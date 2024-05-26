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
import { buyNow } from "@/Services/products/product";
import { useRouter } from "next/navigation";

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
      try{
        const data = await fetchPlacedBids(user.id);
        setBids(data);
      }catch (error: any) {
        console.log(error.message);
      }
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
  const [openBuyModal, setOpenBuyModal] = useState(false);

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

  const updateAfterBuying = () => {
    setThisBid({
      ...thisBid,
      status: "completed",
    });
  }
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
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => {
                  setOpenBidModal(true);
                }}
              >
                Rebid
              </Button>
            )}
            {isPending && isCurrentUserHighestBidder && (
              <>You are the highest bidder</>
            )}
            {isAccepted && isCurrentUserHighestBidder && (
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => {
                  setOpenBuyModal(true);
                }}
              >
                Pay
              </Button>
            )}
            {isCompleted && (
              <>Bid Closed: {thisBid.currenct_high_bid.user.username}</>
            )}
          </>
          {/* Add other action buttons here */}
        </Td>
      </Tr>

      {isPending && !isCurrentUserHighestBidder && (
        <BidModalComponent
          openBidModal={openBidModal}
          setOpenBidBModal={() => setOpenBidModal(!openBidModal)}
          product={thisBid.product}
          // updateThisBid={updateThisBid}
          updateBidder={updateThisBid}
          current_high_bid={thisBid.currenct_high_bid}
        />
      )}

      {isAccepted && isCurrentUserHighestBidder && (
        <BuyModalComponent
          openBuyModal={openBuyModal}
          setOpenBuyModal={() => setOpenBuyModal(!openBuyModal)}
          product={thisBid.product}
          product_bid={thisBid.currenct_high_bid}
          updateAfterBuying={updateAfterBuying}
        />
      )}
    </>
  );
};

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

export const BuyModalComponent = ({
  openBuyModal,
  setOpenBuyModal,
  product,
  product_bid,
  updateAfterBuying
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
  const router = useRouter();
  const sellerName =
    product.seller.firstName && product.seller.lastName
      ? `${product.seller.firstName} ${product.seller.lastName}`
      : product.seller.username;

  const price = product_bid?.bid_price ?? product.price;

  const [totalPrice, setTotalPrice] = useState(price);
  const product_id = product.id;
  const bid_id = product_bid?.id ?? null;

  const BuyFormSchema = z.object({
    quantity: !product_bid ?{} : z.coerce
      .number()
      .max(product.quantity, {
        message: "Quantity must be less than the available quantity",
      })
      .min(1, {
        message: "Quantity must be greater than 0",
      })
      .default(1),
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

    console.log(create_object);
    try {
      setLoading(true);
      let response = await buyNow(create_object);
      response.user = user;
      setLoading(false);
      setOpenBuyModal();
      toast.success("Bid placed successfully");
      router.refresh();
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
                <p className="text-gray-700 mb-4">Sold by: <Link href={`/account/${product.id}`}> {sellerName} </Link></p>
                <p className="text-gray-900 text-xl font-semibold mb-4">
                  ${totalPrice}
                </p>
                {!product_bid && (

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            setTotalPrice(price * parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> )
              }

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
