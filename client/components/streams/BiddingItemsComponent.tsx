import { IProduct, IProductBid } from "@/types/product";
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

interface IProductHostItem extends IProduct {
  highestBidder?: User;
}
export const BiddingItemsComponent = ({ product }: { product: IProduct }) => {
  const [openBidModal, setOpenBidModal] = useState(false);

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
              {product.bidding && product.quantity > 0 && (
                <button
                  onClick={() => setOpenBidModal(true)}
                  className="px-4 py-2 rounded-md border border-black bg-green-400 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                >
                  Bidding
                </button>
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
      <BidModalComponent
        openBidModal={openBidModal}
        setOpenBidBModal={() => {setOpenBidModal(!openBidModal)}}
        product={product}
      />
    </>
  );
};

export const BidModalComponent = ({
  openBidModal,
  setOpenBidBModal,
  product,
}: {
  openBidModal: boolean;
  setOpenBidBModal: () => void;
  product: IProduct;
}) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);


  const bidAmountRef = useRef(null);

  const handleBidSubmit = async () => {
    const bidAmount = bidAmountRef.current.value;

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    try {
      const response = await fetch('/api/bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bidAmount: parseFloat(bidAmount) }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      alert('Bid submitted successfully!');
      // Handle success (e.g., update state, notify user, etc.)
    } catch (error) {
      console.error('There was a problem with the bid submission:', error);
      alert('There was an error submitting your bid');
    }
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
              <div className="mb-4">
                <label
                  htmlFor="bid-amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter your bid amount
                </label>
                <input
                  type="number"
                  id="bid-amount"
                  name="bid-amount"
                  ref={bidAmountRef}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleBidSubmit}
                  className="w-full px-4 py-2 rounded-md border border-black bg-green-500 text-white text-sm font-medium hover:bg-green-600 hover:shadow-md transition duration-200"
                >
                  Bid
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
