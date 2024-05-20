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
import { fetchProductBySeller } from "@/Services/products/productBidService";

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
  const toast = useToast();
  const [bids, setBids] = useState<ProductWithHighestBid[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProductBySeller(user.id);
      if (data.error) {
        toast({
          title: "Failed to fetch bids.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
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
  const handleAction = (action: string) => {
    if (selectedBids.length === 0) {
      toast({
        title: "No bids selected.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    actionHandler(action, selectedBids);
    // setSelectedBids([]);
  };

  function handleCheckboxChange(id: number): void {
    // throw new Error('Function not implemented.');
    console.log(id);
  }

  return (
    <>
      <Button
        size="md"
        colorScheme="green"
        onClick={() => handleAction("bulkApprove")}
        mb={4} // Add some margin to separate the button from the table
      >
        Approve All Selected
      </Button>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
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
                    <Checkbox
                      // isChecked={selectedBids.includes(bid)}
                      onChange={() => handleCheckboxChange(bid.highestBid.id)}
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
  );
}
