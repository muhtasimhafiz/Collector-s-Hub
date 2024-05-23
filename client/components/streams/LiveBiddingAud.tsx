import { useContext, useEffect, useState } from "react";
import socket from "@/Services/socket";
import { fetchProducts } from "@/Services/products/product";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { placeBid } from "@/Services/products/productBidService";
import { IProduct, IProductHostItem } from "@/types/product";
import Image from "next/image";
import Select, { MultiValue } from "react-select";
import CustomMultiSelect from "../ui/multi-select";
import { BiddingItemsComponent } from "./biddingItemsComponent";

interface ProductDropDown {
  value: any;
  label: string;
  thumbnail: string;
}
const LiveBiddingAud = ({ uuid }: { uuid: string }) => {
  const [highestBid, setHighestBid] = useState({ amount: 0, user: "" });
  const [bidAmount, setBidAmount] = useState(0);
  const [userName, setUserName] = useState("");
  const [products, setProducts] = useState<IProductHostItem[]>([]);
  const [productDropDown, setProductDropDown] = useState<ProductDropDown[]>([]);
  const { user } = useContext(AuthContext);
  const [selectedProducts, setSelectedProducts] = useState<IProductHostItem[]>([]);
  // const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    socket.emit("joinRoom", uuid);

    socket.on("highestBid", (bid) => {
      setHighestBid(bid);
    });

    socket.on("roomClosed", (data) => {
      alert(data.message);
      // Handle room closure (e.g., navigate away from the bidding page)
    });

    
    // Listen for highestBid event
    socket.on('bidding-items', (products) => {
      console.log('products:', products);
      setProducts(products);
    });

    socket.emit('get-bidding-items', uuid, (products: IProductHostItem[]) => {
      console.log('Current products:', products);
      setProducts(products);
    });

    socket.on("error", (data) => {
      alert(data.message);
    });

    return () => {
      socket.off("highestBid");
      socket.off("roomClosed");
      socket.off("error");
    };
  }, [uuid]);

  return (
    <div className="flex flex-col justify-center items-center max-h-50">
      <h1>Live Bidding</h1>
      <div className="flex flex-row width-50 overflow-x-auto">
            <h1>Audience</h1>
        {products.map((product) => (
          <BiddingItemsComponent key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default LiveBiddingAud;
