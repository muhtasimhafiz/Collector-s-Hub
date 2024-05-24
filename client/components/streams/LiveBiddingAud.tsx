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
import toast from "react-hot-toast";
import { User } from "@/types/user";
import Link from "next/link";

interface Log {
  user: User;
  message: string;
}
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
  const [logs, setLogs] = useState<Log[]>([]);

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

    socket.on("logs", (logs) => {
      console.log("Received logs:", logs);
      setLogs(logs);
    });

    socket.on("bidRejected", (data) => {
      toast.error(data.reason);
    });

    return () => {
      socket.off("highestBid");
      socket.off("roomClosed");
      socket.off("error");
    };
  }, [uuid]);

  return (
    <div className="flex flex-col justify-center items-center max-h-50">
        <h2 className="text-xl font-semibold mb-4">Live Bidding</h2>
      <div className="flex flex-row width-50 gpa-2 overflow-x-auto">
        {products.map((product) => (
          <BiddingItemsComponent key={product.id} product={product} roomId={uuid} />
        ))}
      </div>
      <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto m-2">
        <h2 className="text-xl font-semibold mb-4">Logs</h2>
        <div className="max-h-20 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.user.id} className="py-2 border-b last:border-none">
              <p>
                <Link
                  href={`/account/${log.user.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {log.user.username}
                </Link>
                : {log.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveBiddingAud;
