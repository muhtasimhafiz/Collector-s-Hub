import React from 'react';
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { IProduct } from '@/types/product';
import { BackgroundGradient } from "@/components/ui/background-gradient";
import Image from "next/image";
import Link from 'next/link';

const ProductCard = ({ product, showLink=false }: { product: IProduct, showLink?: boolean }) => {
  return (
    <CardItem>
      <CardBody>
        <div>
          <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
            <Image
              src={product.image}
              alt="jordans"
              height="400"
              width="400"
              className="object-contain"
            />
            <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
              
              {showLink ?
                <Link href={`/product/${product.id}`}>
                 {product.name}
                </Link> : product.name
              }

            </p>

            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {product.description ?? "No description"}
            </p>
            <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
              <span>Buy now </span>
              <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                $ {product.price}
              </span>
            </button>
          </BackgroundGradient>
        </div>
      </CardBody>
    </CardItem>
  );
};

export default ProductCard;