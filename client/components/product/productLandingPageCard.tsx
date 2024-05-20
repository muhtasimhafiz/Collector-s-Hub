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
import React, { useEffect, useState } from "react";

const ProductLandingPageCard = ({ product }: { product: IProduct }) => {
  const [openBidModal, setOpenBidModal] = useState(false);

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
            className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
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
          {product.bidding && (
            <button
              onClick={() => setOpenBidModal(true)}
              className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            >
              Bidding
            </button>
          )}

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
          $ {Math.round(product.price)}
        </CardItem>
      </div>
      <BidModalComponent
        openBidModal={openBidModal}
        setOpenBidBModal={() => setOpenBidModal(!openBidModal)}
        product={product}
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
}: {
  openBidModal: boolean;
  setOpenBidBModal: () => void;
  product: IProduct;
}) => {
  console.log(product);
  const [highestBid, setHighestBid] = useState(0);
  const [loading, setLoading] = useState(false);

  const biddingFormSchema = z.object({
    bid_price: z.coerce.number().min(highestBid, {
      message: "Bid price must be greater than the highest bid",
    }),
  });

  const form = useForm({
    resolver: zodResolver(biddingFormSchema),
    defaultValues: {
      bid_price: highestBid,
    },
  });

  useEffect(() => {
    if (product && product.bids?.length > 0) {
      const highestBid = product.bids.reduce((prev, current) => {
        return prev.bid_price > current.bid_price ? prev : current;
      });
      setHighestBid(highestBid.bid_price);
    }

    if (product && highestBid === 0) {
      setHighestBid(product.price);
    }
  }, []);

  const onSubmit = async (values: z.infer<typeof biddingFormSchema>) => {
    try {
      
    } catch (error: any) {
      
    }
  };

  return (
    <Dialog open={openBidModal} onOpenChange={setOpenBidBModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bid </DialogTitle>
        </DialogHeader>
        {loading == true ? (
          <Multiloader run={loading} />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogDescription>
                <p>Place your bid: {highestBid}</p>
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
                <DialogFooter>
                  <Button type="submit">Place Bid</Button>
                </DialogFooter>
              </DialogDescription>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductLandingPageCard;
