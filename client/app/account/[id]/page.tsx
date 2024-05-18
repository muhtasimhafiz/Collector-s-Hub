"use client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/hooks/auth/types";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs-acternity";
import { IProduct } from "@/types/product";
import { fetchProducts } from "@/Services/products/product";

interface AccountDetailProps {
  params: { id: string };
}
export default function Page({ params }: AccountDetailProps) {
  const [activeTab, setActiveTab] = useState("photos");
  const [account, setAccount] = useState<User | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const router = useRouter();
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${params.id}`
        );
        const data: User = await response.json();
        
        const user_products = await fetchProducts()
        setAccount(data);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getUser();
  }, [params.id]);

  if (!account) {
    // alert("User not found");
    return <>loading..</>
    // router.back();
  }

  const tabs = [
    {
      title: "Product",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-yellow-700 to-blue-900">
          <p>Product Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Services",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
          <p>Services tab</p>
          <DummyContent />
        </div>
      ),
    },

  ];

  return (
    <div className="min-h-screen flex flex-col container mx-auto p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32">
          <Image
            src="/path-to-avatar.jpg" // Replace with dynamic path
            alt="User Avatar"
            className="rounded-full"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <h1 className="text-2xl font-semibold mt-4">Username</h1>
        <p className="text-gray-600">100 Followers</p>
      </div>

      <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-40">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
}

const DummyContent = () => {
  return (
    <div className="bg-black h-full rounded-2xl p-4 m-0 min-w-full">
      <p>This is dummy content.</p>
    </div>
  );
};
