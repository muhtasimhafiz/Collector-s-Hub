"use client";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import LoginPage from "./login/page";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/utils/cn";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/ui/3d-card-landingPage";
import Link from "next/link";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { IProduct } from "@/types/product";
import { fetchProducts } from "@/Services/products/product";
import ProductCard from "@/components/product/productCardItem";
import Multiloader from "@/components/ui/Multiloader";
import ProductLandingPageCard from "@/components/product/productLandingPageCard";
// import { card } from "";
import Stream from "@/components/streams/page";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FlipWords } from "@/components/ui/flip-words";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await fetchProducts({
          quantity: { gt: 0 },
        });
        console.log(products);
        setProducts(products);
        setLoading(false);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    getProducts();
  }, []);

  const updateProducts = async () => {
    try {
      const products = await fetchProducts({
        quantity: { gt: 0 },
      });
      console.log(products);
      setProducts(products);
      setLoading(false);
    } catch (error: any) {
      console.log(error.message);
    }
  }
  const words = ["Creativity", "Posession", "Memories", "Nostalgia"];

  return (
    <main className="flex min-h-full overflow-hidden flex-col gap-1 items-center justify-center p-4 md:p-24">
      {/* <div className="h-[50rem] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center"> */}
      {loading ? (
        <div>
          <Multiloader run={loading} />
        </div>
      ) : (
        <div className="w-full">
          {/* <div className="mb-4">
            <h1 className="text-2xl md:text-4xl font-bold text-center">
              Welcome to our store
            </h1>
          </div> */}

          <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
            Where passion meets
            <FlipWords words={words} /> <br />
          </div>

          {/* streaming */}
          <div className="flex justify-center">
            <Stream />
          </div>
          {/* Product Listing page */}
          <div className="w-full">
            <h2 className="font-bold text-lg mb-2">Products</h2>
            <div className="flex justify-center flex-row flex-wrap gap-4 sm:w-full md:w-full">
              {products.length > 0 &&
                products.map((product) => (
                  <CardContainer
                    className="py-0 w-10 inter-var h-50 min-w-[15rem]"
                    key={product.id}
                  >
                    <ProductLandingPageCard product={product} updateAfterBuying={updateProducts}/>
                  </CardContainer>
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
