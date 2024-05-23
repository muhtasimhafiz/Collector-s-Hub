import { useContext, useEffect, useState } from "react";
import socket from "@/Services/socket";
import { fetchProducts } from "@/Services/products/product";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { placeBid } from "@/Services/products/productBidService";
import { IProduct, IProductHostItem } from "@/types/product";
import Image from "next/image";
import Select, { MultiValue } from "react-select";
import CustomMultiSelect from "../ui/multi-select";
import { BiddingItemsHostComponent } from "./BiddingItemsHostComponent";
import { User } from "@/types/user";
import Link from "next/link";
interface ProductDropDown {
  value: any;
  label: string;
  thumbnail: string;
}



const LiveBidding = ({ uuid }: { uuid: string }) => {
  const [highestBid, setHighestBid] = useState({ amount: 0, user: "" });
  const [bidAmount, setBidAmount] = useState(0);
  const [userName, setUserName] = useState("");
  const [products, setProducts] = useState<IProductHostItem[]>([]);
  const [productDropDown, setProductDropDown] = useState<ProductDropDown[]>([]);
  const { user 


  } = useContext(AuthContext);

  interface Log {
    user:User;
    message:string;
  }
  
  const [selectedProducts, setSelectedProducts] = useState<IProductHostItem[]>([]);
  // const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  useEffect(() => {
    const fetchUserProducts = async () => {
      if (!user) return;
      console.log("valid");
      try {
        const response:IProductHostItem = await fetchProducts({
          seller_id: user.id,
          quantity: { gt: 0 },
        });
        console.log(response);
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

    socket.on('bidding-items', (products) => {
      console.log('selected products updated:', products);
      setSelectedProducts(products);
    });

    socket.on('logs', (logs) => {
      console.log('Received logs:', logs);
      setLogs(logs);
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
    // setSelectedProducts(selectedProducts);
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
          <BiddingItemsHostComponent key={product.id} product={product} roomId={uuid} />
        ))}
      </div>
      <h2>Logs</h2>
      <div>
        {logs.map((log) => (
          <div key={log.user.id}>
            <p><Link href={`/account/${log.user.id}`}>{log.user.username}</Link>: {log.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveBidding;
