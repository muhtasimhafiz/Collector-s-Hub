"use client";
import { use, useContext, useEffect, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { User } from "@/hooks/auth/types";
import { useRouter } from "next/navigation";
import { Tabs } from "@/components/ui/tabs-acternity";
import { IProduct } from "@/types/product";
import { fetchProducts } from "@/Services/products/product";
import Link from "next/link";
import avatar from "@/assets/photo-1633332755192-727a05c4013d.avif";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cldUpload } from "@/Services/cloudinary";
import { updateUser } from "@/Services/userService";
import Multiloader from "@/components/ui/Multiloader";
import { Divide } from "lucide-react";
import BidTable from "@/components/account/BidTable";
import { AuthContext } from "@/hooks/auth/AuthProvider";

interface AccountDetailProps {
  params: { id: string };
}

export const fileUploadSchema = z.object({
  image: z.any().refine((value) => value instanceof File, {
    message: "Image file is required",
  }),
});

export default function Page({ params }: AccountDetailProps) {
  const [activeTab, setActiveTab] = useState("photos");
  const [account, setAccount] = useState<User | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [OpenDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | StaticImageData>(avatar);
  const [ProfileImage, setProfileImage] = useState<string | StaticImageData>(
    avatar
  );
  const [dialogeLoading, setDialogeLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      image: null,
    },
  });

  const{user} = useContext(AuthContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${params.id}`
        );
        const data: User = await response.json();

        const user_products = await fetchProducts();
        setProducts(user_products);
        setAccount(data);

        if (account.image) {
          setProfileImage(account.image);
          setImageUrl(account.image);
        }

        console.log(ProfileImage);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getUser();
  }, [params.id]);

  if (!account) {
    return (
      <>
        <Multiloader run={true} />
      </>
    );
  }



  const pendingBids =     {
    title: "Pending Bids",
    value: "pending_bids",
    content: (
      <div className=" flex flex-col justify-center w-full pt-4 overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold text-black bg-white shadow-sm border-2">
        <p>Pending Bids</p>
        <PendingBids user={account} />
      </div>
    ),
  };

  const tabs = [
    {
      title: "Product",
      value: "product",
      content: (
        <div className=" flex flex-col justify-center w-full pt-4 overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold text-black bg-white shadow-sm border-2">
          <p>Product Tab</p>
          <DummyContent products={products} />
        </div>
      ),
    },


  ];



  if( user && account.id === user.id) {
    tabs.push(pendingBids);
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      const file = event.target.files[0];

      form.setValue("image", file);

      reader.onload = (e) => {
        setImageUrl(e.target.result as string);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleImageClick = () => {
    setOpenDialog(true);
  };

  const onSubmit = async (values: z.infer<typeof fileUploadSchema>) => {
    try {
      setDialogeLoading(true);
      let data = await cldUpload(values.image, account.id);

      setProfileImage(data.secure_url);
      setImageUrl(data.secure_url);
      setOpenDialog(false);
      await updateUser(account.id, { image: data.secure_url });
      setDialogeLoading(false);
    } catch (error: any) {
      setDialogeLoading(false);
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-full flex flex-col container mx-auto p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32" onClick={handleImageClick}>
          <Image
            src={ProfileImage} // Replace with dynamic path
            alt="User Avatar"
            className="rounded-full"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <h1 className="text-2xl font-semibold mt-4">{account.username}</h1>
        <p className="text-gray-600">100 Followers</p>
      </div>

      <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start">
        <Tabs tabs={tabs} />
      </div>

      <Dialog open={OpenDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          {dialogeLoading ? (
            <div>
              <Multiloader run={dialogeLoading} />
            </div>
          ) : (
            <div>
              <DialogHeader>
                <DialogTitle>Change Avatar</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center relative w-32 h-32">
                <Image
                  src={imageUrl} // Replace with dynamic path
                  alt="User Avatar"
                  className="rounded-full"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input type="file" onChange={handleImageChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Submit</Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const DummyContent = ({ products }: { products: IProduct[] }) => {
  return (
    <div
      className="border-2 shadow bg-grey-600 min-h-full w-full rounded-2xl p-4 m-0 min-w-full flex flex-row flex-wrap overflow-y-scroll justify-around"
      style={{ maxHeight: "200px" }}
    >
      {products.map((product) => (
        <div key={product.id} className="p-2">
          <div className="bg-white rounded-xl">
            <Link href={`/product/${product.id}`}>
            <Image
              src={product.image} // Replace with dynamic path
              alt="Product Image"
              className="rounded-xl"
              // layout="responsive"
              objectFit="contain"
              width={100}
              height={100}
            />
            </Link>

            <h1 className="text-sm test-black font-semibold mt-2 p-1">
              <Link href={`/product/${product.id}`}>{product.name}</Link>
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
};

const PendingBids = ({ user }: { user: User }) => {
  return (
    <div
      className="border-2 shadow bg-grey-600 min-h-full w-full rounded-2xl p-4 m-0 min-w-full flex flex-row flex-wrap overflow-y-scroll justify-around"
      // style={{ maxHeight: "200px" }}
    >
      <BidTable user={user} />
    </div>
  );
};
