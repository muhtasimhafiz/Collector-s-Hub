import { IProductBid } from "@/types/product"

export const placeBid = (product_id: number, update: Partial<IProductBid>) => {
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
    return res.json();
  });
}

export const fetchProductBids = async (where: Partial<IProductBid> = {}) => {
  try {
    const queryParams = new URLSearchParams(where as any).toString();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-bid?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export const fetchProductBySeller = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-bid/seller/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export const fetchPlacedBids = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-bid/placed-bids/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Failed to fetch bids");
  }
}

export const acceptBids = async (bids: IProductBid[]) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-bid/accept-bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(bids),
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}



export const acceptBid = async (id: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/product-bid/accept-bid/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch {
    console.error("Failed to accept bid");
  }
}


