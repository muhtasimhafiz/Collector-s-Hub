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
    <main className="flex min-h-screen flex-row gap-1 items-center justify-center p-24">
      {loading == true ? (
        <div>
          <Multiloader run={loading} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.length>0 && products?.map((product) => (
            <CardContainer key={product.id}>
              <ProductCard product={product} 
                showLink={true}
              />
            </CardContainer>
          ))}
        </div>
      )}
    </main>
  );
}
