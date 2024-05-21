import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { IProduct } from "@/types/product";
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

const ProductLandingPageCard = ({ product }: { product: IProduct }) => {
  const [openBidModal, setOpenBidModal] = useState(false);
  const [highestBidder, setHighestBidder] = useState<User | null>(null);
  const { user } = useContext(AuthContext);
  const [highestBid, setHighestBid] = useState(0);
  const [bidding, setBidding] = useState(false);

  useEffect(() => {
    if (product.bidding && product.bids && product.bids.length > 0) {
      const bidder = product.bids?.reduce((prev, current) => {
        return prev.bid_price > current.bid_price ? prev : current;
      });
      if (bidder.user) {
        setHighestBidder(bidder.user);
        setHighestBid(bidder.bid_price); 
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
    <CardBody className="h-50 bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[15rem] md:w-[14rem] p-2 border rounded-xl">
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
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">Buy Now</Button>
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
                        Listed December 2021
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </CardItem>
        <CardItem
          translateZ={20}
          as="button"
          className="px-2 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
        >
          $ {Math.round(highestBid)}
        </CardItem>
      </div>
      <BidModalComponent
        openBidModal={openBidModal}
        setOpenBidBModal={() => setOpenBidModal(!openBidModal)}
        product={product}
        updateBidder={updateBidder}
        highestBidder={highestBidder}
      />
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
import { placeBid } from "@/Services/products/productBidService";
import { User } from "@/types/user";
import { AuthContext } from "@/hooks/auth/AuthProvider";
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
    }else {
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

export default ProductLandingPageCard;
