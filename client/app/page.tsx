"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import LoginPage from "./login/page";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/utils/cn";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { IProduct } from "@/types/product";
import { fetchProducts } from "@/Services/products/product";
import ProductCard from "@/components/product/productCardItem";
import Multiloader from "@/components/ui/Multiloader";
import ProductLandingPageCard from "@/components/product/productLandingPageCard";
// import { card } from "";
import Stream from "@/components/streams/page";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log(data);
        setProducts(data);
        setLoading(false);
      } catch (error: any) {}
    };

    getProducts();
  }, []);
  return (
    <main className="flex min-h-screen flex-col gap-1 items-center justify-center p-4 md:p-24">
      {loading ? (
        <div>
          <Multiloader run={loading} />
        </div>
      ) : (
        <div className="w-full">
          <div className="mb-4">
            <h1 className="text-2xl md:text-4xl font-bold text-center">
              Welcome to our store
            </h1>
          </div>
          <div className="mb-4">
            <h1 className="font-bold text-lg">Stream</h1>
            <div className="flex justify-center">
              <Stream />
            </div>
          </div>
          {/* Product Listing page */}
          <div className="w-full">
            <h2 className="font-bold text-lg mb-2">Products</h2>
            <div className="flex flex-row overflow-x-auto gap-4 whitespace-nowrap w-80 sm:w-full md:w-full">
              {products.length > 0 &&
                products.map((product) => (
                  <CardContainer
                    className="inter-var h-50 min-w-[15rem]"
                    key={product.id}
                  >
                    <ProductLandingPageCard product={product} />
                  </CardContainer>
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
