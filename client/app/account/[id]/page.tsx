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
import {
  cldUpload,
  cldUploadVideo,
} from "@/Services/cloudinary";
import { updateUser } from "@/Services/userService";
import Multiloader from "@/components/ui/Multiloader";
import BidTable from "@/components/account/BidSellerTable";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import BidUserTable from "@/components/account/BidUserTable";
import TransactionTable from "@/components/account/TransactionTable";
import ReelList from "@/components/video/ReelListComponent";
import { createVideo, fetchVideos } from "@/Services/videoService";
import toast from "react-hot-toast";
import { IVideo } from "@/types/video";
import Select from "react-select";
import { create } from "domain";

interface AccountDetailProps {
  params: { id: string };
}

export const fileUploadSchema = z.object({
  image: z.any().refine((value) => value instanceof File, {
    message: "Image file is required",
  }),
});
export const reelUploadSchema = z.object({
  thumbnail: z.any().refine((value) => value instanceof File, {
    message: "Thumbnail file is required",
  }),
  video: z.any().refine((value) => value instanceof File, {
    message: "Video file is required",
  }),
  caption: z.string().min(1, { message: "Caption is required" }),
  product_id: z.any().optional(),
});

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

const PlacedBids = ({ user }: { user: User }) => {
  return (
    <div
      className="border-2 shadow bg-grey-600 min-h-full w-full rounded-2xl p-4 m-0 min-w-full flex flex-row flex-wrap overflow-y-scroll justify-around"
      // style={{ maxHeight: "200px" }}
    >
      <BidUserTable user={user} />
    </div>
  );
};

const Transactions = ({ user }: { user: User }) => {
  return (
    <div
      className="border-2 shadow bg-grey-600 min-h-full w-full rounded-2xl p-4 m-0 min-w-full flex flex-row flex-wrap overflow-y-scroll justify-around"
      // style={{ maxHeight: "200px" }}
    >
      <TransactionTable user={user} />
    </div>
  );
};
const UsersVideos = ({ user, videos }: { user: User; videos: IVideo[] }) => {
  return (
    <div
      className="border-2 shadow bg-grey-600 min-h-full w-full rounded-2xl p-4 m-0 min-w-full flex flex-row flex-wrap overflow-y-scroll justify-around"
      // style={{ maxHeight: "200px" }}
    >
      {/* <VideoComponent user_id={Number(user.id)} />
       */}

      <ReelList user={user} initialReels={videos} />
    </div>
  );
};

const Page = ({ params }: AccountDetailProps) => {
  const [activeTab, setActiveTab] = useState("photos");
  const [account, setAccount] = useState<User | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | StaticImageData>(avatar);
  const [profileImage, setProfileImage] = useState<string | StaticImageData>(
    avatar
  );

  const [openReelUpload, setOpenReelUpload] = useState(false);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [productDropdown, setProductDropdown] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      image: null,
    },
  });
  const reelForm = useForm({
    resolver: zodResolver(reelUploadSchema),
    defaultValues: {
      thumbnail: null,
      video: null,
      caption: "",
      product_id: 1,
    },
  });
  const { user } = useContext(AuthContext);

  const fetchDataVideos = async () => {
    try {
      let searchObj = { user_id: params.id };
      const data = await fetchVideos(searchObj);
      setVideos(data);
    } catch (error: any) {
      toast.error("Error fetching videos: " + error.message);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${params.id}`
        );
        const data: User = await response.json();
        const userProducts = await fetchProducts({ seller_id: params.id });
        setProducts(userProducts);
        setAccount(data);
        setProductDropdown(
          userProducts.map((product) => ({
            label: product.name,
            value: product.id,
          }))
        );
        if (data.image) {
          setProfileImage(data.image);
          setImageUrl(data.image);
        }
      } catch (error: any) {
        toast.error("Error fetching user: " + error.message);
      }
    };
    getUser();
    fetchDataVideos();
  }, [params.id]);

  if (!account) {
    return <Multiloader run={true} />;
  }

  const tabs = [
    {
      title: "Products",
      value: "products",
      content: (
        <div className="min-w-full flex flex-col justify-center w-full pt-4 overflow-hidden relative h-full rounded-2xl text-xl font-bold text-black bg-white shadow-sm border-2">
          <div className="p-4">
            <h1>Products</h1>
          </div>
          <DummyContent products={products} />
        </div>
      ),
    },
    {
      title: "Reels",
      value: "videos",
      content: (
        <div className="flex flex-col justify-center w-full pt-4 overflow-hidden relative h-full rounded-2xl text-xl font-bold text-black bg-white shadow-sm border-2">
          <div className="p-4 flex justify-between">
            <h1>Reels</h1>
            <Button onClick={() => setOpenReelUpload(true)}>Upload Reel</Button>
          </div>
          <UsersVideos user={account} videos={videos} />
        </div>
      ),
    },
  ];

  if (user && account.id === user.id) {
    const userTabs = [
      {
        title: "Pending Bids",
        value: "pending_bids",
        content: (
          <div className="flex flex-col justify-center min-w-full pt-4 overflow-hidden relative h-full rounded-2xl text-xl font-bold text-black bg-white shadow-sm border-2">
            <div className="p-4">
              <h1>Pending Bids</h1>
            </div>
            <PendingBids user={account} />
          </div>
        ),
      },
      {
        title: "Placed Bids",
        value: "placed_bids",
        content: (
          <div className="flex flex-col justify-center w-full pt-4 overflow-hidden relative h-full rounded-2xl text-xl font-bold text-black bg-white shadow-sm border-2">
            <div className="p-4">
              <h1>Placed Bids</h1>
            </div>
            <PlacedBids user={account} />
          </div>
        ),
      },
      {
        title: "Transactions",
        value: "transactions",
        content: (
          <div className="flex flex-col justify-center w-full pt-4 overflow-hidden relative h-full rounded-2xl text-xl font-bold text-black bg-white shadow-sm border-2">
            <div className="p-4">
              <h1>Transaction</h1>
            </div>
            <Transactions user={account} />
          </div>
        ),
      },
    ];
    tabs.push(...userTabs);
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const file = event.target.files[0];
      form.setValue("image", file);

      reader.onload = (e) => {
        setImageUrl(e.target.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    setOpenDialog(true);
  };

  const onSubmit = async (values: z.infer<typeof fileUploadSchema>) => {
    try {
      setDialogLoading(true);
      const data = await cldUpload(values.image, account.id);

      setProfileImage(data.secure_url);
      setImageUrl(data.secure_url);
      setOpenDialog(false);
      await updateUser(account.id, { image: data.secure_url });
      setDialogLoading(false);
    } catch (error: any) {
      setDialogLoading(false);
      toast.error("Error uploading image: " + error.message);
    }
  };

  const onUploadReel = async (values: z.infer<typeof reelUploadSchema>) => {
    console.log(values);
    // const reelData = {
    //   ...values,
    //   user_id: account.id,
    // }

    try {
      setUploading(true);
      const thumbnail = await cldUpload(values.thumbnail, user?.id);
      const video = await cldUploadVideo(values.video, user?.id);
      const reelData = {
        thumbnail: thumbnail.secure_url,
        video: video.secure_url,
        user_id: account.id,
        product_id: values.product_id,
      };

      const data = await createVideo(reelData);
      toast.success("Reel uploaded successfully");
      setUploading(false);
      fetchDataVideos();
    } catch (error: any) {
      setUploading(false);
      toast.error("Error uploading reel: " + error.message);
      console.log("error ", error.message);
    }
  };

  return (
    <div className="min-h-full min-w-96 flex flex-col p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32" onClick={handleImageClick}>
          <Image
            src={profileImage}
            alt="User Avatar"
            className="rounded-full"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <h1 className="text-2xl font-semibold mt-4">{account.username}</h1>
      </div>

      <div className="w-full h-[20rem] md:h-[40rem] flex flex-col max-w-5xl mx-auto items-start justify-start">
        <Tabs tabs={tabs} />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          {dialogLoading ? (
            <Multiloader run={dialogLoading} />
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Change Avatar</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center relative w-32 h-32">
                <Image
                  src={imageUrl}
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
                        <FormLabel>Upload Image</FormLabel>
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
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openReelUpload} onOpenChange={setOpenReelUpload}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Reel</DialogTitle>
          </DialogHeader>
          {uploading && <Multiloader run={uploading} />}
          {uploading == false && (
            <Form {...reelForm}>
              <form onSubmit={reelForm.handleSubmit(onUploadReel)}>
                <FormField
                  control={reelForm.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            reelForm.setValue("thumbnail", file);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={reelForm.control}
                  name="video"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            reelForm.setValue("video", file);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={reelForm.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={reelForm.control}
                  name="product_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <Select
                          options={productDropdown}
                          // closeMenuOnSelect={false}
                          placeholder="Select Product"
                          {...field}
                          onChange={(value) => {
                            field.onChange(value.value); // Update form state when selected
                            // Add any additional logic here if needed (e.g., fetch product details)
                          }}
                        />
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
