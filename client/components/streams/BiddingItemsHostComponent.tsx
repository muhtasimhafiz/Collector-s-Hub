import { IProduct, IProductHostItem } from "@/types/product";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card-landingPage";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Socket } from "socket.io-client";
import socket from "@/Services/socket";

export const BiddingItemsHostComponent = ({
  product,
  roomId
}: {
  product: IProductHostItem;
  roomId: string;
}) => {
  console.log("HostItem")
  console.log(product);

  const acceptBid = (product: IProductHostItem) => {
    console.log("acceptBid", product);
    socket.emit('accept-bid', {roomId,product});
  }
  return (
    <CardContainer>
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
            {!product.auction_status && (
              <>
                {product.bidding && product.quantity > 0 ? (
                  <>
                    {product.highestBidder && (
                      <>
                        <button
                          onClick={() => acceptBid(product)}
                          className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                        >
                          Accept Bid
                        </button>
                      </>
                    )}

                    {!product.highestBidder && (
                      <button
                      // onClick={() => acceptBid()}
                      className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                    >
                      Bidding
                    </button>
                    )}
                    
                  </>
                ) : (
                  product.quantity <= 0 && (
                    <button
                      // onClick={() => setOpenBidModal(true)}
                      className="px-4 py-2 rounded-md border border-black bg-red-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                    >
                      Sold Out
                    </button>
                  )
                )}
              </>
            )}

            {product.auction_status === "accepted" && (
              <>
                <button
                  // onClick={() => setOpenBidModal(true)}
                  className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                >
                  You have accepted the bid of {product.prices}
                </button>
              </>
            )}

            {(product.auction_status === "completed" || product.auction_status == 'sold')&&  (
              <>
                <button
                  // onClick={() => setOpenBidModal(true)}
                  className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                >
                  Sold
                </button>
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
  );
};
