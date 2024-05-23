"use client"
import { IProduct, IProductBid, IProductHostItem } from "@/types/product";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import React, { useContext, useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { any, set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { placeBid } from "@/Services/products/productBidService";
import Multiloader from "../ui/Multiloader";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { User } from "@/types/user";
import { Button } from "../ui/button";
import { Socket } from "socket.io-client";
import socket from "@/Services/socket";

export const BiddingItemsComponent = ({
  product,
  roomId,
}: {
  product: IProductHostItem;
  roomId: any;
}) => {
  const [openBidModal, setOpenBidModal] = useState(false);
  // const [product, setProduct] = useState<IProductHostItem>(product);
  console.log("test");
  console.log(product);

  const { user } = useContext(AuthContext);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  return (
    <>
      <CardContainer>
        <CardBody className="h-50 bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[15rem] md:w-[14rem] p-2 border rounded-xl">
          <CardItem
            translateZ="50"
            className="text font-bold text-neutral-600 dark:text-white"
          >
            {product.name}
          </CardItem>
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
              {!product.auction_status && (
                <>
                  {product.bidding && product.quantity > 0 && (
                    <>
                      {product?.highestBidder?.id == user?.id ? (
                        <>
                          <button
                            // onClick={() => acceptBid(product)}
                            className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                          >
                            Your are the highest bidder
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setOpenBidModal(true)}
                            className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                          >
                            Bidding
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {product.quantity <= 0 && (
                    <button
                      // onClick={() => setOpenBidModal(true)}
                      className="px-4 py-2 rounded-md border border-black bg-red-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                    >
                      Sold Out
                    </button>
                  )}

                  {!product.bidding && product.quantity > 0 && (
                    <button
                      // onClick={() => setOpenBidModal(true)}
                      className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                    >
                      Buy Now
                    </button>
                  )}
                </>
              )}

              {(product.auction_status === "completed" || product.auction_status == "sold") && (
                <>
                  {product.highestBidder?.id === user?.id ? (
                    <>
                      <button
                        onClick={() => setOpenBuyModal(true)}
                        className="px-4 py-2 rounded-md border border-black bg-blue-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                      >
                        You won the bid
                      </button>
                    </>
                  ) : (
                    <button
                      // onClick={() => setOpenBidModal(true)}
                      className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                    >
                      {product.highestBidder?.username} won the bid
                    </button>
                  )}
                </>
              )}
              {(product.auction_status === "accepted" ) && (
                <>
                  {product.highestBidder?.id === user?.id ? (
                    <>
                      <button
                        onClick={() => setOpenBuyModal(true)}
                        className="px-4 py-2 rounded-md border border-black bg-blue-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                      >
                        You won the bid[buy]
                      </button>
                    </>
                  ) : (
                    <button
                      // onClick={() => setOpenBidModal(true)}
                      className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                    >
                      {product.highestBidder?.username} won the bid
                    </button>
                  )}
                </>
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
        </CardBody>
      </CardContainer>

      {!product.auction_status && (
        <BidModalComponent
          openBidModal={openBidModal}
          setOpenBidBModal={() => {
            console.log("close modal")
            setOpenBidModal(!openBidModal)
          }}
          product={product}
          roomId={roomId}
        />
      )}
    </>
  );
};

export const BidModalComponent = ({
  openBidModal,
  setOpenBidBModal,
  product,
  roomId,
}: {
  openBidModal: boolean;
  setOpenBidBModal: () => void;
  product: IProductHostItem;
  roomId: any;
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const bidAmountRef = useRef(null);

  const biddingFormSchema = z.object({
    bid_price: z.coerce.number().min(product.price + 1, {
      message: "Bid price must be greater than the highest bid",
    }),
    message: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(biddingFormSchema),
    defaultValues: {
      bid_price: product.price + 1,
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof biddingFormSchema>) => {
    console.log("submit")
    setOpenBidBModal();
    product.price = values.bid_price;
    product.highestBidder = user ?? undefined;
     socket.emit("newBid", {
      roomId: roomId,
      product: product,
    });
  };

  return (
    <Dialog open={openBidModal} onOpenChange={setOpenBidBModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Bfafid for {product.name}</DialogTitle>
          <DialogTitle>
            {/* Highest bidder {current_high_bid.user?.username ?? "N/A"} */}
          </DialogTitle>
        </DialogHeader>
        {loading == true ? (
          <Multiloader run={loading} />
        ) : (
          <div>
            {/* <CardItem translateZ="100" className="w-full mt-2"> */}
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
            {/* </CardItem> */}
            <DialogDescription>{product.description}</DialogDescription>
            <div className="p-4 bg-white shadow-md rounded-md max-w-sm mx-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label
                      htmlFor="bid-amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter your bid amount
                    </label>
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
                    ></FormField>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded-md border border-black bg-green-500 text-white text-sm font-medium hover:bg-green-600 hover:shadow-md transition duration-200"
                    >
                      Bid
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const BuyModalComponent = ({
  openBidModal,
  setOpenBidBModal,
  product,
  roomId,
}: {
  openBidModal: boolean;
  setOpenBidBModal: () => void;
  product: IProductHostItem;
  roomId: any;
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const bidAmountRef = useRef(null);

  const biddingFormSchema = z.object({
    bid_price: z.coerce.number().min(product.price + 1, {
      message: "Bid price must be greater than the highest bid",
    }),
    message: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(biddingFormSchema),
    defaultValues: {
      bid_price: product.price + 1,
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof biddingFormSchema>) => {
    product.price = values.bid_price;
    product.highestBidder = user;
    socket.emit("newBid", {
      roomId: roomId,
      product: product,
    });
  };

  return (
    <Dialog open={openBidModal} onOpenChange={setOpenBidBModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Bid for {product.name}</DialogTitle>
          <DialogTitle>
            {/* Highest bidder {current_high_bid.user?.username ?? "N/A"} */}
          </DialogTitle>
        </DialogHeader>
        {loading == true ? (
          <Multiloader run={loading} />
        ) : (
          <div>
            {/* <CardItem translateZ="100" className="w-full mt-2"> */}
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
            {/* </CardItem> */}
            <DialogDescription>{product.description}</DialogDescription>
            <div className="p-4 bg-white shadow-md rounded-md max-w-sm mx-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label
                      htmlFor="bid-amount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Enter your bid amount
                    </label>
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
                    ></FormField>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded-md border border-black bg-green-500 text-white text-sm font-medium hover:bg-green-600 hover:shadow-md transition duration-200"
                    >
                      Bid
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
