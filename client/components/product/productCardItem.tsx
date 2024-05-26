import React, { useContext, useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { IProduct, IProductBid } from "@/types/product";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { User } from "@/types/user";

const ProductCard = ({
  product,
  showLink = false,
  updateProduct
}: {
  product: IProduct;
  showLink?: boolean;
  updateProduct: () => void;
}) => {
  const [productState, setProductState] = useState<IProduct>(product);

  const [openBidModal, setOpenBidModal] = useState(false);
  const [highestBidder, setHighestBidder] = useState<User | null>(null);
  const { user } = useContext(AuthContext);
  const [highestBid, setHighestBid] = useState(0);
  const [bidding, setBidding] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [product_bid, setProductBid] = useState<IProductBid | null>(null);

  useEffect(() => {
    if (product.bidding && product.bids && product.bids.length > 0) {
      const bidder = product.bids?.reduce((prev, current) => {
        return prev.bid_price > current.bid_price ? prev : current;
      });
      if (bidder.user) {
        setHighestBidder(bidder.user);
        setHighestBid(bidder.bid_price);
        setProductBid(bidder);
      } else {
        setHighestBid(product.price);
      }
    } else {
      setHighestBid(product.price);
    }
  }, []);

  const updateBidder = (bidder: User) => {
    setHighestBidder(bidder);
  };

  return (
    <CardItem>
      <CardBody>
        <div>
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
            <Image
              src={product.image}
              alt="jordans"
              height="400"
              width="400"
              className="object-contain"
            />
            <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
              {showLink ? (
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              ) : (
                product.name
              )}
            </p>

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {product.description ?? "No description"}
            </p>


              {/* wrap the entire block with if it has user  && user != seller id */}
            {product.bidding &&
              (user && highestBidder && highestBidder.id === user.id && product.seller_id!=user.id? (
                <div>You are the highest bidder</div>
              ) : (
                <button onClick={()=>setOpenBidModal(true)} className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-green mt-4 text-xs font-bold dark:bg-zinc-800">
                  <span>Bid now </span>
                  <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                    $ {product.price}
                  </span>
                </button>
              ))}

            {product.bidding == false && user && user.id !=product.seller_id && (
              <button onClick={()=>setOpenBuyModal(true)} className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
                <span>Buy now </span>
                <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                  $ {product.price}
                </span>
              </button>
            )}

            {/* if not logged in show this block */}

            {/* <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
              <span>Buy now </span>
              <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                $ {product.price}
              </span>
            </button> */}
          </BackgroundGradient>
        </div>
        {highestBidder &&
        user &&
        product.bidding &&
        highestBidder?.id != user?.id && (
          <BidModalComponent
            openBidModal={openBidModal}
            setOpenBidBModal={() => setOpenBidModal(!openBidModal)}
            product={product}
            updateProduct={updateProduct}
            highestBidder={highestBidder}
          />
        )}
      {user &&
        (product.bidding == false ||
          (product_bid?.status == "accepted" &&
            highestBidder &&
            highestBidder.id == user.id)) && (
          <BuyModalComponent
            openBuyModal={openBuyModal}
            setOpenBuyModal={() => setOpenBuyModal(!openBuyModal)}
            product={product}
            product_bid={product_bid}
            updateProduct={updateProduct}
          />
        )}
      </CardBody>
    </CardItem>
  );
};


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { any, set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Multiloader from "../ui/Multiloader";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";
import { acceptBid, placeBid } from "@/Services/products/productBidService";
import { buyNow } from "@/Services/products/product";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

// export const biddingFormSchema = z.object({
//   bid_price: z.number().min(1, {
//     message: "Bid price must be greater than 0",
//   }),
// });

export const BidModalComponent = ({
  openBidModal,
  setOpenBidBModal,
  product,
  updateProduct,
  highestBidder,
}: {
  openBidModal: boolean;
  setOpenBidBModal: () => void;
  updateProduct: () => void;
  product: IProduct;
  highestBidder: User | null;
}) => {
  // console.log(product);
  const [highestBid, setHighestBid] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const biddingFormSchema = z.object({
    bid_price: z.coerce.number().min(highestBid + 1, {
      message: "Bid price must be greater than the highest bid",
    }),
    message: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(biddingFormSchema),
    defaultValues: {
      bid_price: highestBid,
      message: "",
    },
  });

  useEffect(() => {
    if (product && product.bids?.length > 0) {
      console.log("checking for highest bid");
      const bid = product.bids.reduce((prev, current) => {
        return prev.bid_price > current.bid_price ? prev : current;
      });

      if (bid) {
        console.log("placing bids");
        console.log(bid.bid_price);
        setHighestBid(bid.bid_price);
      } else {
        setHighestBid(product.price);
      }
    } else {
      setHighestBid(product.price);
    }
  }, []);

  const onSubmit = async (values: z.infer<typeof biddingFormSchema>) => {
    try {
      setLoading(true);
      const response = await placeBid(product.id, values);
      setLoading(false);
      setOpenBidBModal();
      updateProduct();
      toast.success("Bid placed successfully");
    } catch (error: any) {
      setLoading(false);
      console.error("Error placing bid:", error.message);
      toast.error("Failed to place bid");
    }
  };

  return (
    <Dialog open={openBidModal} onOpenChange={setOpenBidBModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Bid for {product.name}</DialogTitle>
          <DialogTitle>
            Highest bidder {highestBidder?.username ?? "N/A"}
          </DialogTitle>
        </DialogHeader>
        {loading == true ? (
          <Multiloader run={loading} />
        ) : (
          <div>
            <CardItem translateZ="100" className="w-full mt-2">
              <Link
                href={`/product/${product.id}`}
                // href={`/product/${product.id}`}
              >
                <Image
                  src={product.image}
                  height="1000"
                  width="1000"
                  className="h-40 w-full object-contain rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </Link>
            </CardItem>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* <DialogDescription> */}
                Place your bid: {highestBid}
                <FormField
                  control={form.control}
                  name="bid_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price(USD)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-2">
                  <Button type="submit">Place Bid</Button>
                </DialogFooter>
                {/* </DialogDescription> */}
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const BuyModalComponent = ({
  openBuyModal,
  setOpenBuyModal,
  product,
  product_bid,
  updateProduct,
}: // current_high_bid,
{
  openBuyModal: boolean;
  setOpenBuyModal: () => void;
  updateProduct: () => void;
  product: IProduct;
  product_bid?: IProductBid | null;
  // current_high_bid: IProductBid;
}) => {
  // console.log(product);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  // const router = useRouter();
  const [quantity, setQuantity] = useState(product.quantity);
  const sellerName =
    product.seller.firstName && product.seller.lastName
      ? `${product.seller.firstName} ${product.seller.lastName}`
      : product.seller.username;

  const price = product_bid?.bid_price ?? product.price;

  const [totalPrice, setTotalPrice] = useState(price);
  const product_id = product.id;
  const bid_id = product_bid?.id ?? null;

  const BuyFormSchema = z.object({
    quantity: product_bid
      ? z
          .number()
          .max(product.quantity, {
            message: "Quantity must be less than the available quantity",
          })
          .min(1, {
            message: "Quantity must be greater than 0",
          })
          .default(1)
      : z.number().optional(), // Or set to null or a default value if required
    // message: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(BuyFormSchema),
    defaultValues: {
      quantity: 1,

      // message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof BuyFormSchema>) => {
    const create_object = {
      ...values,
      product_id,
      bid_id,
    };

    try {
      setLoading(true);
      let response = await buyNow(create_object);
      console.log(response);
      response.user = user;
      setLoading(false);
      setOpenBuyModal();
      toast.success("Purchase successfull");
      // router.refresh();
      updateProduct();
    } catch (error: any) {
      setLoading(false);
      console.error("Failed to Buy", error.message);
      toast.error("Failed to place bid");
    }
  };

  return (
    <Dialog open={openBuyModal} onOpenChange={setOpenBuyModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> {product.name}</DialogTitle>
        </DialogHeader>
        {loading == true ? (
          <Multiloader run={loading} />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="p-6">
                <Image
                  className="w-full h-64 object-cover object-center mb-4"
                  src={product.image}
                  alt={product.name}
                  width="50"
                  height="50"
                  layout="responsive"
                  objectFit="cover"
                />
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-700 mb-4">
                  Sold by:{" "}
                  <Link href={`/account/${product.id}`}> {sellerName} </Link>
                </p>
                <p className="text-gray-900 text-xl font-semibold mb-4">
                  ${totalPrice}
                </p>
                {!product_bid && (
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity ({quantity})</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              setQuantity(parseInt(e.target.value));
                              setTotalPrice(price * parseInt(e.target.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <p className="text-gray-700 mb-6">{product.description}</p>
                <Button
                  type="submit"
                  className="w-full bg-black-600 text-white bg-black font-bold py-2 px-4 rounded hover:bg-blue-600"
                >
                  Buy Now for ${Number(totalPrice)}
                </Button>
              </div>
            </form>
          </Form>
          // {loading && <Multiloader run={loading} />}
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;
