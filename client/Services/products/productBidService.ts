import { IProductBid } from "@/types/product"

export const placeBid = (product_id:number, update:Partial<IProductBid>) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-bid/place-bid/${product_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(update),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to place bid");
    }
  });
}