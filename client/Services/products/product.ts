import { serverURL } from "@/utils/utility";

export const fetchProductCategory = async () => {
  try {
    const response = await fetch(`${serverURL}/products/category`);
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(error);
    return { error: error.message };
  }

} 