import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/ui/3d-card-landingPage";
import { IProduct, IProductBid } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useContext, useEffect, useState } from "react";

const ProductLandingPageCard = ({
  product,
  updateAfterBuying,
}: {
  product: IProduct;
  updateAfterBuying: () => void;
}) => {
  const [openBidModal, setOpenBidModal] = useState(false);
  const [highestBidder, setHighestBidder] = useState<User | null>(null);
  const { user } = useContext(AuthContext);
  const [highestBid, setHighestBid] = useState(0);
  const [bidding, setBidding] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [product_bid, setProductBid] = useState<IProductBid | null>(null);
  console.log(highestBid);
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
    <CardBody className="h-25 sm:30 sm:20 sm:50 bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1]  sm:w-[15rem] md:w-[14rem] p-2 border rounded-xl">
      <CardItem
        translateZ="50"
        className="text font-bold text-neutral-600 dark:text-white"
      >
        {product.name}
      </CardItem>
      {/* <CardItem
    as="p"
    translateZ="60"
    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
  >
    Hover over this card to unleash the power of CSS perspective
  </CardItem> */}
      <CardItem translateZ="100" className="w-50 mt-2">
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
      <div className="flex justify-between items-center mt-2">
        <CardItem
          translateZ={20}
          // as={Link}
          // href={`/product/${product.id}`}
          // target="__blank"
          className="rounded-xl text-xs font-normal dark:text-white"
        >
          {product.bidding &&
            (user && highestBidder && highestBidder.id === user.id ? (
              <div>You are the highest bidder</div>
            ) : (
              <button
                onClick={() => setOpenBidModal(true)}
                className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              >
                Bidding
              </button>
            ))}

          {product.bidding == false && (
            <button
              onClick={() => setOpenBuyModal(true)}
              className="px-4 py-2 rounded-md border border-black bg-emerald-600 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            >
              Buy
            </button>
          )}
        </CardItem>
        <CardItem
          translateZ={20}
          as="button"
          className="px-2 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
        >
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" className="text-white">
                $ {Math.round(highestBid)}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage
                    src={
                      product.seller?.image ?? "https://github.com/vercel.png"
                    }
                  />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">
                    <Link href={`/account/${product.seller_id}`}>
                      @{product.seller?.username}
                    </Link>
                  </h4>
                  <p className="text-sm">{product.description ?? "N/a"}</p>
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">
                      Listed on {product.createdAt ?? ""}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardItem>
      </div>
      {highestBidder &&
        user &&
        product.bidding &&
        highestBidder?.id != user?.id && (
          <BidModalComponent
            openBidModal={openBidModal}
            setOpenBidBModal={() => setOpenBidModal(!openBidModal)}
            product={product}
            updateBidder={updateBidder}
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
            updateAfterBuying={updateAfterBuying}
          />
        )}
    </CardBody>
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
import { User } from "@/types/user";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { buyNow } from "@/Services/products/product";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// export const biddingFormSchema = z.object({
//   bid_price: z.number().min(1, {
//     message: "Bid price must be greater than 0",
//   }),
// });

export const BidModalComponent = ({
  openBidModal,
  setOpenBidBModal,
  product,
  updateBidder,
  highestBidder,
}: {
  openBidModal: boolean;
  setOpenBidBModal: () => void;
  updateBidder: (bidder: User) => void;
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

      if (user) {
        updateBidder(user);
      }
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
  updateAfterBuying,
}: // current_high_bid,
{
  openBuyModal: boolean;
  setOpenBuyModal: () => void;
  updateAfterBuying: () => void;
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
      toast.success("Bid placed successfully");
      // router.refresh();
      updateAfterBuying();
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
                  className="w-full bg-black-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
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

export default ProductLandingPageCard;
