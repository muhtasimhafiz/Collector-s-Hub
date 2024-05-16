"use client";
import { useEffect, useState } from "react";
import { IProduct } from "@/types/product";
import { CardContainer } from "@/components/ui/3d-card";
import ProductCard from "@/components/product/productCardItem";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductReviews from "@/components/product/productReviews";

interface ProductDetailProps {
  params: { id: string };
}

const ProductDetail = ({ params }: ProductDetailProps) => {
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.id}`
        );
        const data: IProduct = await response.json();
        setProduct(data);
      } catch (error: any) {
        console.log(error.message);
        console.error(error);
      }
    };
    getProduct();
  }, [params.id]);

  return (
    product && (
      <div className="h-full flex flex-col">
        <CardContainer className="self-start">
          <ProductCard product={product} />
        </CardContainer>
        <section>
          <ProductReviews />
        </section>
      </div>
    )
  );
};

export default ProductDetail;
