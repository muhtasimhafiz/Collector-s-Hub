import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays } from "lucide-react";

const ProductLandingPageCard = ({ product }: { product: IProduct }) => {
  return (
<CardBody className="h-50 bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[15rem] md:w-[14rem] p-2 border rounded-xl">
  <CardItem
    translateZ="50"
    className="text font-bold text-neutral-600 dark:text-white"
  >
    {product.name}
  </CardItem>
  {/* <CardItem
    as="p"
    translateZ="60"
    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
  >
    Hover over this card to unleash the power of CSS perspective
  </CardItem> */}
  <CardItem translateZ="100" className="w-full mt-2">
    <Image
      src={product.image}
      height="1000"
      width="1000"
      className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
      alt="thumbnail"
    />
  </CardItem>
  <div className="flex justify-between items-center mt-2">
    <CardItem
      translateZ={20}
      as={Link}
      href={`/product/${product.id}`}
      target="__blank"
      className="rounded-xl text-xs font-normal dark:text-white"
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">Buy Now</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src={product.seller?.image ?? "https://github.com/vercel.png"} />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">
                <Link href={`/account/${product.seller_id}`}>@{product.seller?.username}</Link>
              </h4>
              <p className="text-sm">
                {product.description ?? "N/a"}
              </p>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  Listed December 2021
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </CardItem>
    <CardItem
      translateZ={20}
      as="button"
      className="px-2 py-1 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
    >
      $ {product.price}
    </CardItem>
  </div>
</CardBody>

  );
};

export default ProductLandingPageCard;
