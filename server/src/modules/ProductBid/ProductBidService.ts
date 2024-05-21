import BaseService from "../../service/BaseService";
import { IProduct } from "../Products/interfaces/IProduct";
import { Product } from "../Products/models/Product";
import { User } from "../Users/models/User";
import { ProductBid } from "./models/ProductBid";
import { Request } from 'express';
import { IProductBid, ProductBidStatus } from "./types";
import { sequelize } from "../../../config/database";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";

// class ProductBidService  {
//   // private model: Model<Product,>;
//   async findAll(req: Request|null): Promise<ProductBid[]> {
//     try {
//       // Add any request-specific filtering logic here if needed
//       const productBids = await ProductBid.findAll();
//       return productBids;
//     } catch (error) {
//       console.error('Error retrieving ProductBid instances:', error);
//       throw new Error('Error retrieving ProductBid instances');
//     }
//   }
// }



class ProductBidService extends BaseService<ProductBid> {
  // private model: Model<Product,>;
  constructor() {
    super(ProductBid);
  }

  async findHighestBidsBySeller(req: Request | null, user_id: number) {
    try {
      const products = await Product.findAll({
        where: {
          seller_id: user_id
        },
        include: [
          {
            model: ProductBid,
            as: 'bids',
            where: {
              status: 'pending'
            },
            include: [
              {
                model: User,
                as: 'user'
              }
            ],
            required: true,
          }
        ],
        order: [
          [{ model: ProductBid, as: 'bids' }, 'bid_price', 'DESC']
        ]
      });

      // console.log(products[0].bids[0]);
      // return products;


      interface ProductWithHighestBid {
        highestBid: IProductBid;
        // user:User;
        product_id: number;
        product_name: string;
        product_description?: string;
        product_image: string;
      }
      const res: ProductWithHighestBid[] = [];
      for (const product of products) {
        if (product.bids.length) {
          let elem = {
            highestBid: product.bids[0],
            // user:product.bids[0].user,
            product_id: product.id,
            product_name: product.name,
            product_description: product.description,
            product_image: product.image
          };
          elem.highestBid = product.bids[0];
          res.push(elem);
        }
      }

      return res;

    } catch (error) {
      console.error('Error retrieving ProductBid instances:', error);
      throw new Error('Error retrieving ProductBid instances');
    }
  }


  async findHighestBidByProduct(req: Request | null, product_id: number) {

    try {
      const product = await Product.findByPk(product_id, {
        include: [
          {
            model: ProductBid,
            as: 'bids',
            where: {
              status: {
                [Op.or]: ['pending', 'completed']
              }
            },
            include: [
              {
                model: User,
                as: 'user'
              }
            ],
            required: true,
            order: [
              ['bid_price', 'DESC']
            ]
          }
        ]
      });

      if (!product) {
        throw new Error('Product not found');
      }

      if (!product.bids.length) {
        return null;
      }

      return product.bids[0];

    } catch (error) {
      console.error('Error retrieving ProductBid instances:', error);
      throw new Error('Error retrieving ProductBid instances');
    }
  }


  async findPlacedBids(req: Request | null, user_id: number) {
    try {
      const productBids = await ProductBid.findAll({
        where: {
          user_id,
        },
        include: [
          {
            model: Product,
            as: 'product',
            include: [
              {
                model: ProductBid,
                as: 'bids',
                where: {
                  status: {
                    [Op.or]: ['pending', 'completed','accepted']
                  }
                },
                include: [
                  {
                    model: User,
                    as: 'user'
                  }
                ],
                order: [
                  ['bid_price', 'DESC']
                ]
              }
            ]
          }
        ]
      });

      //sorting by bid price (nested);
      productBids.forEach(productBid => {
        if (productBid.product && productBid.product.bids) {
          productBid.product.bids.sort((a, b) => b.bid_price - a.bid_price);
        }
      });

      // return productBids;

      interface myHighestBids {
        product: IProduct;
        bid_price: number;
        status: string;
        message?: string;
        currenct_high_bid: IProductBid;
        // current_hight_bidder: User;
      }

      let res: myHighestBids[] = [];


      for (let i of productBids) {
        if (i.product) {
          let highestBid = i.product.bids[0];
          // Remove the bids property from the product
          const { bids, ...productWithoutBids } = i.product.get({ plain: true });
          let elem: myHighestBids = {
            product: productWithoutBids,
            bid_price: i.bid_price,
            status: i.status,
            message: i.message,
            currenct_high_bid: highestBid as IProductBid,
          };
          res.push(elem);
        }
      }

      return res;
    } catch (error) {
      console.error('Error retrieving ProductBid instances:', error);
      throw new Error('Error retrieving ProductBid instances');
    }
  }

  //  highestBidder = (bids: IProductBid[]) => {
  //   if (!bids.length) {
  //     return null;
  //   }
  //   return bids[0];
  // }

  async acceptBid(req: Request | null, bid_id: number) {
    const transaction = await sequelize.transaction();
    try {

      const productBid = await ProductBid.findByPk(bid_id, {
        include: [
          {
            model: Product,
            as: 'product'
          }
        ]
      });

      if (!productBid) {
        throw new Error('Product bid not found');
      }


      //update rest of the bid status to reject
      // await ProductBid.update({
      //   status: ProductBidStatus.rejected
      // }, {
      //   where: {
      //     product_id: productBid.product.id,
      //     status: ProductBidStatus.pending,
      //   }
      // }
      // );

      productBid.status = 'accepted';
      await productBid.save();

      const product = await Product.findByPk(productBid.product_id);
      if (!product || product.seller_id !== (req as any).user.id) {
        throw new Error('Product not found');
      }

      if (product.quantity) {
        product.quantity = product.quantity - 1;
      }
      await product.save();

      return productBid;

    } catch (error) {
      await transaction.rollback();
      console.error('Error retrieving ProductBid instances:', error);
      throw new Error('Error retrieving ProductBid instances');
    }
  }

  /* async acceptBidArray(req: Request | null, bid_ids: number[]) {
    const transaction = await sequelize.transaction();
    try {

      const productBids = await ProductBid.findAll({
        where: {
          id: {
            [Op.in]: bid_ids
          }
        },
        include: [
          {
            model: Product,
            as: 'product'
          }
        ]
      });


      if (productBids) {
        throw new Error('Product bid not found');
      }

      let productIds = productBids.map((productBid: ProductBid) => productBid.product_id);

      await ProductBid.update({
        status: ProductBidStatus.rejected
      }, {
        where: {
          // product_id: {
          //   [Op.in]: productIds
          // },
          status: ProductBidStatus.pending,
        }
      }
      );
      await ProductBid.update({
        status: ProductBidStatus.rejected
      }, {
        where: {
          product_id: {
            [Op.in]: productIds
          },
          status: ProductBidStatus.accepted,
        }
      }
      );

      const data = await Product.update({
        quantity: Sequelize.literal('quantity - 1')
      }, {
        where: {
          id: {
            [Op.in]: productIds
          }
        }
      });

      return data;

    } catch (error) {
      await transaction.rollback();
      console.error('Error retrieving ProductBid instances:', error);
      throw new Error('Error retrieving ProductBid instances');
    }
  }
 */
}
export default new ProductBidService();