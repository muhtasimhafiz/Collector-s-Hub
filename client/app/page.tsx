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
import {card} from "";

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
    <main className="flex min-h-screen flex-col gap-1 items-center justify-center p-24">
      {loading == true ? (
        <div>
          <Multiloader run={loading} />
        </div>
      ) : (
        <div>
          <div>
            <h1 className="text-4xl font-bold text-center">
              Welcome to our store
            </h1>
          </div>
          <div>
            <h1>
              Stream
            </h1>
            <div class="flex flex-row">


            </div>
          </div>


          {/* Product Listing page */}
          <div className="flex flex-row flex-wrap gap-1">
            <CardContainer className="inter-var"></CardContainer>
            {products.length > 0 &&
              products?.map((product) => (
                <CardContainer className="inter-var" key={product.id}>
                  <ProductLandingPageCard product={product} />
                </CardContainer>
              ))}
          </div>
        </div>
      )}
    </main>
  );
}
