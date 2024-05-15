"use client";
import Select from "react-select";
import Lottie, { useLottie } from "lottie-react";
import { Button } from "@/components/ui/button";
import loader from "@/assets/loader-1.json";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { any, set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cldUpload } from "@/Services/cloudinary";
import {
  createDropdownOptions,
  createProduct,
  fetchProductCategory,
} from "@/Services/products/product";
import { Currency } from "lucide-react";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }),
  description: z.string().min(6, {
    message: "Description must be at least 6 characters long",
  }),
  price: z.coerce.number().min(1, {
    message: "Price must be at least 1",
  }),
  image: z.any().refine((value) => value instanceof File, {
    message: "Image file is required",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1",
  }),
  // category_id: z.coerce.number().min(1, "Category is required"),
  category_id: z.array(z.any()),

  // category:z.coerce.string().min(1, {
  bidding: z.boolean(),
  // seller_id: z.coerce.number().min(1, "Seller is required"),
  seller_id: z.coerce.number(),

  currency: z.string()
});

export default function Page() {
  const { login, user } = useContext(AuthContext);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: null,
      quantity: 0,
      category_id: [],
      currency: "USD",
      bidding: false,
      seller_id: user?.id ?? 0,
    },
  });

  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const categoryList = useRef<any[]>([]);

  //drop zone code
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const reader = new FileReader();

        reader.onload = (e) => {
          setImageUrl(e.target?.result as string);
        };

        reader.readAsDataURL(acceptedFiles[0]);
        setFile(acceptedFiles[0]);
      }
    },
  });

  // const formRef = useRef();

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        categoryList.current = createDropdownOptions(
          await fetchProductCategory()
        );
      } catch (error) {
        console.error("Error fetching product categories:", error);
      }
    };

    fetchData();
  }, []);

  if (!isMounted) {
    return null;
  }

  //on file change code
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      const file = event.target.files[0];

      form.setValue("image", file);

      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      values.seller_id = user?.id??0;
      try {
        if (user) {
          let data = await cldUpload(values.image, user.id);
          values.image = data.secure_url;
        }
        const product = await createProduct(values);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      }

      setLoading(false);
      // router.push(`/product/${data.id}`);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-10 flex flex-col sm:flex-row h-[500px] sm:h-auto">
      <div className="self-start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <input type="hidden" name="seller_id" value={user?.id} />
            <input type="hidden" name="currency" value={"USD"} />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      options={categoryList.current}
                      // closeMenuOnSelect={false}
                      placeholder="Select Category"
                      isMulti
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price(USD)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={handleImageChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <div>
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className="p-4 border-dashed border-4"
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the image here...</p>
                      ) : (
                        <p>
                          Drag 'n' drop an image here, or click to select an
                          image
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          /> */}

            <FormField
              control={form.control}
              name="bidding"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ marginRight: "10px" }}>
                    Bidding?
                  </FormLabel>
                  <FormControl>
                    <Checkbox {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <section>
              <Button type="submit">Submit</Button>
            </section>
          </form>
        </Form>
      </div>
      {imageUrl && (
        <div className="w-full mb-3 sm:w-[450px] h-[200px] sm:h-[450px]">
          {/* <AspectRatio ratio={16 / 9}> */}
          <Image
            width={1600}
            height={900}
            src={imageUrl}
            alt="Image"
            className="rounded-md object-cover"
          />
          {/* </AspectRatio> */}
        </div>
      )}
    </div>
  );
}
