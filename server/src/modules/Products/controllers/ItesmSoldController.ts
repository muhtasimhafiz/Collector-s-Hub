import { Request, Response } from "express";
import ItemsSoldService from "../services/ItemsSoldService";
import { ItemsSold } from "../models/ItemsSold";
import { ProductBid } from "../../ProductBid/models/ProductBid";
import { Product } from "../models/Product";
import { sequelize } from "../../../../config/database";
import { ProductBidStatus } from "../../ProductBid/types";
import { Op } from "sequelize";
import { User } from "../../Users/models/User";
export const createItemsSold = async (req: Request, res: Response) => {
  // try {
  //   const { user_id, product_id } = req.body;
  //   const itemsSold = await createItemsSold.create({
  //     user_id,
  //     product_id,
  //   });
  //   return res.status(201).json(itemsSold);
  // } catch (error: any) {
  //   console.log(error);
  //   return res.status(400).json({ message: "error creating items sold" });
  // }
}


export const getItemsSold = async (req: Request, res: Response) => {
  try {
    const where = ItemsSoldService.parseQueryParams(req.query);
    const itemsSold = await ItemsSold.findAll(
      {
        where: where
      }
    );
    return res.status(200).json(itemsSold);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export const getTransactionsByUser = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.id;
    const where = {
      [Op.or]: [
        { buyer_id: user_id },
        { '$product.seller_id$': user_id }
      ]
    };
    const itemsSold = await ItemsSold.findAll({
      where: where,
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: User,
              as: 'seller'
            }
          ]
        },
        {
          model:User,
          as:'buyer'
        }

      ]
    });
    return res.status(200).json(itemsSold);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export const BuyItems = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  console.log("something")
  const { product_id, bid_id, quantity } = req.body;
  console.log(req.body)
  let bid = null;
  let product = null;
  let user_id = null;
  if (!(req as any).user) {
    return res.status(400).json({ message: "User not found" });
  } 

  user_id = (req as any).user.id;

  try {
    bid = bid_id && await ProductBid.findByPk(bid_id);
    product = product_id && await Product.findByPk(product_id);

    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    let total_price = product.price * quantity;
    if (bid) {
      total_price = bid.bid_price * quantity;
    }

    // for bidding products the quantity is subtracted before hand when the bid is first accepted
    if (bid) {
      bid.status = ProductBidStatus.completed

      await ProductBid.update({
        status: ProductBidStatus.rejected
      }, {
        where: {
          product_id: product_id,
          status: ProductBidStatus.pending
        }
      });

      await ProductBid.update({
        status: ProductBidStatus.rejected
      }, {
        where: {
          product_id: product_id,
          status: ProductBidStatus.pending
        }
      });

      const data = await bid.save();
      console.log(data);
    } else {
      product.quantity = product.quantity - quantity;
      await product.save();
    }

    if (bid && bid.user_id !== (req as any).user.id) {
      return res.status(400).json({ message: "Invalid bid" });
    }


    const itemsSold = await ItemsSoldService.create(req,
      {
        buyer_id:user_id,
        product_id:product_id,
        product_bid_id: bid_id,
        quantity:quantity,
        total_price:total_price
      }
    );

    return res.status(200).json(itemsSold);
  } catch (error: any) {
    await transaction.rollback();
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }

}