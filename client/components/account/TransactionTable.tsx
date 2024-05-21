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
import { IItemsSold, IProduct, IProductBid } from "@/types/product";
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
import { buyNow, getTransactionsByUser } from "@/Services/products/product";
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
export default function TransactionTable({ user }: { user: User }) {
  const [data, setData] = useState<IItemsSold[]>([])
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTransactionsByUser(user.id);
      console.log(data);
      setData(data);
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
                  <Th>Price</Th>
                  <Th>Seller</Th>
                  <Th>Buyer</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data  &&
                  data.map((d) => (
                    <>
                      <TableRow key={d.id} row={d} />
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

export const TableRow = ({ row }) => {
  const { user } = useContext(AuthContext);
  const isUserBuyer = row.buyer_id === user.id;
  const isUserSeller = row.seller_id === user.id;
  return (
    <>
      <Tr key={row.id}>
        <Td>
          <Image
            src={row.product.image}
            alt={row.product_name}
            width="50"
            height="50"
          />
        </Td>
        <Td>{row.product.name}</Td>
        <Td>${row.total_price}</Td>
        <Td>
          <Link href={`/account/${row.seller_id}`}>{row.product.seller.username}</Link>
        </Td>
        <Td>
          <Link href={`/account/${row.buyer_id}`}>{row.buyer.username}</Link>
        </Td>
        <Td>
          <>
            {isUserBuyer && <>purchase</>}

            {isUserSeller && <>sale</>}
          </>
          {/* Add other action buttons here */}
        </Td>
      </Tr>
    </>
  );
};
