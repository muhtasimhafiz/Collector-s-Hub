/**
 * v0 by Vercel.
 * @see https://v0.dev/t/srTZtUXzHMF
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { IProductReview } from "@/types/product";
import z, { string } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postReview } from "@/Services/products/product";
import { useState } from "react";
import './style.css';

export const formSchema = z.object({
  user_id: z.string(),
  review: z.string().min(6, {
    message: "Review must be at least 6 characters long",
  }),
  product_id: z.string(),
});

export default function Component({
  product_id,
  reviews,
}: {
  product_id: string;
  reviews: IProductReview[];
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
      review: "",
      product_id: product_id,
    },
  });
  const   [reviewList, setReviewList] = useState<IProductReview[]>(reviews);
  
  // setReviewList(reviews)
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  form.setValue('user_id', user.id.toString())
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('submit')
    console.log(values);
    try {

      const repsonse = await postReview(values);
      console.log(repsonse);
      setReviewList([...reviewList, repsonse]);
      form.reset();
    } catch (error: any) {
      console.error(error);
      // setLoading(false);

    }
  };
  return (
    <div className="w-full max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4">
        {user ? (
          <div className="grid gap-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <input type="hidden" name="user_id"/>
                <input type="hidden" name="product_id" />
                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="mb-2"
                          placeholder="Write your review..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button>Submit</Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Please login to leave a review
          </div>
        )}
        <div className="space-y-6">
          {reviewList.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {review.user && (
                    <div className="font-semibold">@{review.user.username}</div>
                  )}
                  <div className="text-gray-500 text-xs dark:text-gray-400">
                    5 months ago
                  </div>
                </div>
              </div>
              <div>{review.review}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
