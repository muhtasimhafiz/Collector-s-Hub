import { User } from "@/hooks/auth/types";

export const updateUser = (id:number,data:Partial<User>) => {
  // Add your implementation here
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()).catch((error) => {
    console.error(error);
  });
}