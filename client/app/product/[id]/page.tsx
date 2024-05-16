"use client";
import { useEffect, useState } from "react";
import { IProduct, IProductReview } from "@/types/product";
import { CardContainer } from "@/components/ui/3d-card";
import ProductCard from "@/components/product/productCardItem";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductReviews from "@/components/product/productReviews";
import { User } from "@/types/user";

interface ProductDetailProps {
  params: { id: string };
}


 // interface ProductReviewDetail extends IProductReview {
//   user:User
// }
interface ProductDetail extends IProduct {
  reviews: IProductReview[]; 
}
const ProductDetail = ({ params }: ProductDetailProps) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  // const [product_id, setProduct_id] = useState<number>(Number(params.id));

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/product/${params.id}`
        );
        const data: ProductDetail = await response.json();
        setProduct(data);
      } catch (error: any) {
        console.log(error.message);
        // console.error(error);
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
          <ProductReviews product_id={params.id} reviews={product.reviews} />
        </section>
      </div>
    )
  );
};

export default ProductDetail;