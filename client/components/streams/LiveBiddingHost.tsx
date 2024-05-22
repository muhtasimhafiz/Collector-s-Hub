import { useContext, useEffect, useState } from "react";
import socket from "@/Services/socket";
import { fetchProducts } from "@/Services/products/product";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { placeBid } from "@/Services/products/productBidService";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Select, { MultiValue } from "react-select";
import CustomMultiSelect from "../ui/multi-select";
import { BiddingItemsComponent } from "./biddingItemsComponent";

interface ProductDropDown {
  value: any;
  label: string;
  thumbnail: string;
}
const LiveBidding = ({ uuid }: { uuid: string }) => {
  const [highestBid, setHighestBid] = useState({ amount: 0, user: "" });
  const [bidAmount, setBidAmount] = useState(0);
  const [userName, setUserName] = useState("");
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productDropDown, setProductDropDown] = useState<ProductDropDown[]>([]);
  const { user } = useContext(AuthContext);
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
  // const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const fetchUserProducts = async () => {
      console.log(user.id);
      if (!user) return;
      console.log("valid");
      try {
        const response = await fetchProducts({ seller_id: user.id });
        setProducts(response);
        setProductDropDown(
          response.map((product) => ({
            value: product.id,
            label: product.name,
            thumbnail: product.image,
          }))
        );
      } catch (err: any) {
        console.log(err);
      }
    };

    socket.on("highestBid", (bid) => {
      setHighestBid(bid);
    });

    fetchUserProducts();

    socket.emit("createRoom", uuid);

    socket.on("bidRejected", (data) => {
      alert(data.reason);
    });

    return () => {
      socket.off("highestBid");
      socket.off("bidRejected");
    };
  }, []);

  const listProducts = () => {
    socket.emit("newBid", { amount: bidAmount, user: userName });
  };

  const handleSelect = (selectedOptions: MultiValue<ProductDropDown>) => {
    const selectedProductIds = selectedOptions.map((option) => option.value);
    const selectedProducts = products.filter((product) =>
      selectedProductIds.includes(product.id)
    );
    setSelectedProducts(selectedProducts);
    socket.emit("add-bidding-item", {
      products: selectedProducts,
      roomId: uuid,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center max-h-50">
      <h1>Live Bidding</h1>
      <div>
        <CustomMultiSelect options={productDropDown} onSelect={handleSelect} />
      </div>
      {/* selected products for bidding */}
      <div className="flex flex-row width-50 overflow-x-auto">
        {selectedProducts.map((product) => (
          <BiddingItemsComponent key={product.id} product={product} />
        ))}
      </div>
      <h2>
        Current Highest Bid: ${highestBid.amount} by {highestBid.user}
      </h2>
      <input
        type="text"
        placeholder="Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Your Bid"
        value={bidAmount}
        onChange={(e) => setBidAmount(Number(e.target.value))}
      />
      <button onClick={placeBid}>Place Bid</button>
    </div>
  );
};

export default LiveBidding;
