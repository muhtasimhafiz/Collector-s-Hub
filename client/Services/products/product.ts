import { IProduct } from "@/types/product";
import { serverURL } from "@/utils/utility";

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



interface ProductCategories_ProductCreation {
  value: string;
  label: string;
}
interface ProductCreation extends Omit<IProduct, 'id'> {
  category_id: ProductCategories_ProductCreation[];
}
export const createProduct = async (product: ProductCreation) => {
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

export const fetchProducts = async (where:Partial<IProduct> = {}) => {
  try {
    const queryParams = new URLSearchParams(where as any).toString();
    const response = await fetch(`${serverURL}product?${queryParams}`);
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }
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
  } catch (error:any) {
    console.error(error);
    console.log(error.message)
  }

}
