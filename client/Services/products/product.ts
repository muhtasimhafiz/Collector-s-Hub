import { IProduct, IProductBid } from "@/types/product";
import { serverURL } from "@/utils/utility";
import { any } from "zod";

export const fetchProductCategory = async () => {
  try {
    const response = await fetch(`${serverURL}product-category`);
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export const createDropdownOptions = <T, K extends keyof T>(array: T[], valueKey: K = 'id' as K, labelKey: K = 'name' as K): { value: T[K], label: T[K] }[] => {
  return array.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }));
};


export const fetchProductBidsWhere = async (where: Partial<IProductBid> = {}) => {
  try {
    const queryParams = new URLSearchParams(where as any).toString();
    const response = await fetch(`${serverURL}product-bid?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}



interface ProductCategories_ProductCreation {
  value: string;
  label: string;
}
interface ProductCreation extends Omit<IProduct, 'id'> {
  category_id: ProductCategories_ProductCreation[];
}
export const createProduct = async (product: Partial<IProduct>) => {
  // Add your implementation here
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${serverURL}product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product),
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export const fetchProducts = async (where: Partial<IProduct> = {}) => {
  try {
    const encodedParams = new URLSearchParams();
    for (const key in where) {
      if (where.hasOwnProperty(key)) {
        const value = (where as any)[key];
        // Assuming the value is an object with operators and values
        if (typeof value === 'object' && value !== null) {
          for (const operator in value) {
            if (value.hasOwnProperty(operator)) {
              encodedParams.append(`${key}[${operator}]`, value[operator]);
            }
          }
        } else {
          encodedParams.append(key, value);
        }
      }
    }
    const queryParams = encodedParams.toString();
    const response = await fetch(`${serverURL}/product?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
};


export const fetchProductLandingPage = async (where: Partial<IProduct> = {}) => {

}


export const postReview = async (review: { product_id: string, review: string }) => {
  try {
    const response = await fetch(`${serverURL}product/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(review),
    });

    return await response.json();
  } catch (error: any) {
    console.error(error);
    console.log(error.message)
  }

}


export const buyNow = async (createObject: { product_id: any, bid_id: any, quantity: any }) => {
  try {
    const response = await fetch(`${serverURL}/buy-now`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(createObject),
    });

    return await response.json();
  } catch (error: any) {
    console.error(error);
    console.log(error.message)
  }
}


export const fetchItemsSold = async (where: any = {}) => {
  try {
    const encodedParams = new URLSearchParams();
    for (const key in where) {
      if (where.hasOwnProperty(key)) {
        const value = (where as any)[key];
        // Assuming the value is an object with operators and values
        if (typeof value === 'object' && value !== null) {
          for (const operator in value) {
            if (value.hasOwnProperty(operator)) {
              encodedParams.append(`${key}[${operator}]`, value[operator]);
            }
          }
        } else {
          encodedParams.append(key, value);
        }
      }
    }
    const queryParams = encodedParams.toString();
    const response = await fetch(`${serverURL}/product/items-sold?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
}

export const getTransactionsByUser = async (user_id: any) => {
  try {
    const response = await fetch(`${serverURL}product/items-sold/transaction/${user_id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
  }
}
