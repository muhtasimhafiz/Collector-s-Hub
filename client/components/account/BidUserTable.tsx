import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import { User } from "@/types/user";
import { IProduct, IProductBid } from "@/types/product";
import {
  acceptBid,
  fetchPlacedBids,
  fetchProductBySeller,
} from "@/Services/products/productBidService";
import Image from "next/image";
import Multiloader from "../ui/Multiloader";
import toast from "react-hot-toast";
import Link from "next/link";

export interface ProductWithHighestBid {
  currenct_high_bid: IProductBid;
  // user:User;
  product_id: number;
  product_name: string;
  product_description?: string;
  product_image: string;
}

export interface myHighestBids {
  product: IProduct;
  bid_price: number;
  status: string;
  message?: string;
  currenct_high_bid: IProductBid;
  // current_hight_bidder: User;
}
export default function BidTable({ user }: { user: User }) {
  const [selectedBids, setSelectedBids] = useState<myHighestBids[]>([]);
  // const toast = useToast();
  const [bids, setBids] = useState<myHighestBids[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPlacedBids(user.id);
      if (data.error) {
        // toast({
        //   title: "Failed to fetch bids.",
        //   status: "error",
        //   duration: 3000,
        //   isClosable: true,
        // });
        toast.error("Failed to fetch your bids.");
        return;
      }
      setBids(data);
    };

    fetchData();
  }, []);

  // const handleCheckboxChange = (bidId) => {
  //   setSelectedBids((prevSelected) =>
  //     prevSelected.includes(bidId)
  //       ? prevSelected.filter((id) => id !== bidId)
  //       : [...prevSelected, bidId]
  //   );
  // };

  const handleSelectAll = () => {
    setSelectedBids(selectedBids.length === bids.length ? [] : bids);
  };

  const actionHandler = (
    action: string,
    selectedBids: ProductWithHighestBid[]
  ) => {
    console.log("action handler");
  };

  const handleAction = async (
    action: string,
    bid: ProductWithHighestBid | ProductWithHighestBid[]
  ) => {
    console.log("return");
    return;
    if (selectedBids.length === 0 && !bid) {
      toast.error("Please select a bid to approve.");
      return;
    }

    if (bid instanceof Array) {
    } else {
      try {
        setLoading(true);
        const response = await acceptBid(bid.currenct_high_bid.id);
        setLoading(false);

        // remove the bid from the bids list
        setBids((prevBids) => prevBids.filter((b) => b !== bid));
        toast.success("Bid approved successfully.");
      } catch (error) {
        setLoading(false);
        toast.error("Failed to approve bid.");
      }
    }

    actionHandler(action, selectedBids);
    // setSelectedBids([]);
  };

  function handleCheckboxChange(id: number): void {
    // throw new Error('Function not implemented.');
    console.log(id);
  }

  return (
    <div>
      {loading == true ? (
        <Multiloader run={loading} />
      ) : (
        <>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <Th>Image</Th>
                  </Th>
                  {/* <Th>
                    <Checkbox onChange={handleSelectAll} />
                  </Th> */}
                  <Th>Product Name</Th>
                  <Th>Bid Price</Th>
                  <Th>Highest Bidder</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bids.length > 0 &&
                  bids.map((bid) => (
                    <>
                      <TableRow
                        key={bid.currenct_high_bid.id}
                        bid={bid}
                        handleAction={handleAction}
                      />
                    </>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}

export const TableRow = ({ bid, handleAction }) => {
  const [openBidModal, setOpenBidModal] = useState(false);
  const [thisBid, setThisBid] = useState(bid);
  const { user } = useContext(AuthContext);

  const isPending = thisBid.status === "pending";
  const isAccepted = thisBid.status === "accepted";
  const isCompleted = thisBid.status === "completed";
  const isCurrentUserHighestBidder = thisBid.currenct_high_bid.user.id === user.id;

  const updateThisBid = (new_high_bid: IProductBid) => {
    setThisBid({
      ...thisBid,
      currenct_high_bid: new_high_bid,
      bid_price: new_high_bid.bid_price,
    });
  };
  return (
    <>
      <Tr key={thisBid.currenct_high_bid.id}>
        <Td>
          <Image
            src={thisBid.product.image}
            alt={thisBid.product_name}
            width="50"
            height="50"
          />
        </Td>
        <Td>{thisBid.product.name}</Td>
        <Td>${thisBid.currenct_high_bid.bid_price}</Td>
        <Link href={`/account/${thisBid.currenct_high_bid.user.id}`}>
          <Td>{thisBid.currenct_high_bid.user.username}</Td>
        </Link>
        <Td>
          <>
            {isPending && !isCurrentUserHighestBidder && (
              <Button size="sm" colorScheme="blue" onClick={()=>{setOpenBidModal(true)}}>
                Rebid
              </Button>
            )}
            {isPending && isCurrentUserHighestBidder && (
              <>You are the highest bidder</>
            )}
            {isAccepted && isCurrentUserHighestBidder && (
              <Button size="sm" colorScheme="green" onClick={''}>
                Pay
              </Button>
            )}
            {isCompleted && (
              <>Highest bidder: {thisBid.currenct_high_bid.user.name}</>
            )}
          </>
          {/* Add other action buttons here */}
        </Td>
      </Tr>
      <BidModalComponent
        openBidModal={openBidModal}
        setOpenBidBModal={() => setOpenBidModal(!openBidModal)}
        product={thisBid.product}
        // updateThisBid={updateThisBid}
        updateBidder={updateThisBid}
        current_high_bid={thisBid.currenct_high_bid}
      />
    </>
  );
};

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { any, set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { placeBid } from "@/Services/products/productBidService";
import { AuthContext } from "@/hooks/auth/AuthProvider";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const BidModalComponent = ({
  openBidModal,
  setOpenBidBModal,
  product,
  updateBidder,
  current_high_bid,
}: {
  openBidModal: boolean;
  setOpenBidBModal: () => void;
  product: IProduct;
  updateBidder: (new_high_bid: IProductBid) => void;
  current_high_bid: IProductBid;
}) => {
  // console.log(product);
  const [highestBid, setHighestBid] = useState(current_high_bid.bid_price);
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

  const onSubmit = async (values: z.infer<typeof biddingFormSchema>) => {
    try {
      setLoading(true);
      let response = await placeBid(product.id, values);
      response.user = user;
      updateBidder(response);
      setLoading(false);
      setOpenBidBModal();

      // if (user) {
      //   updateBidder(user);
      // }
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
            Highest bidder {current_high_bid.user?.username ?? "N/A"}
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
