
import React, { useEffect, useState } from "react";
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
import { IProductBid } from "@/types/product";
import { acceptBid, fetchProductBySeller } from "@/Services/products/productBidService";
import Image from "next/image";
import Multiloader from "../ui/Multiloader";
import toast from "react-hot-toast";

export interface ProductWithHighestBid {
  highestBid: IProductBid;
  // user:User;
  product_id: number;
  product_name: string;
  product_description?: string;
  product_image: string;
}
export default function BidTable({ user }: { user: User }) {
  const [selectedBids, setSelectedBids] = useState<ProductWithHighestBid[]>([]);
  // const toast = useToast();
  const [bids, setBids] = useState<ProductWithHighestBid[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProductBySeller(user.id);
      if (data.error) {
        console.log(data.error);
        // toast({
        //   title: "Failed to fetch bids.",
        //   status: "error",
        //   duration: 3000,
        //   isClosable: true,
        // });

        toast.error("Failed to fetch bids.");
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
    if (selectedBids.length === 0 && !bid) {
      toast.error("Please select a bid to approve.")
      return;
    }

    if (bid instanceof Array) {
    } else {
      try {
        setLoading(true);
        const response = await acceptBid(bid.highestBid.id);
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
          {/* <Button
            size="md"
            colorScheme="green"
            onClick={() => handleAction("bulkApprove", selectedBids)}
            mb={4} // Add some margin to separate the button from the table
          >
            Approve All Selected
          </Button> */}
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <Th>Image</Th>
                  </Th>
                  <Th>
                    <Checkbox onChange={handleSelectAll} />
                  </Th>
                  <Th>Status</Th>
                  <Th>Product Name</Th>
                  <Th>Bid Price</Th>
                  <Th>Username</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bids.length > 0 &&
                  bids.map((bid) => (
                    <Tr key={bid.highestBid.id}>
                      <Td>
                        <Image
                          src={bid.product_image}
                          alt={bid.product_name}
                          width="50"
                          height="50"
                        />
                      </Td>
                      <Td>
                        <Checkbox
                          // isChecked={selectedBids.includes(bid)}
                          onChange={() =>
                            handleCheckboxChange(bid.highestBid.id)
                          }
                        />
                      </Td>
                      <Td>{bid.highestBid.status}</Td>
                      <Td>{bid.product_name}</Td>
                      <Td>${bid.highestBid.bid_price}</Td>
                      <Td>{user ? user.username : "Unknown"}</Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleAction("approve", bid)}
                        >
                          Approve
                        </Button>
                        {/* Add other action buttons here */}
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}
