/**
 * v0 by Vercel.
 * @see https://v0.dev/t/srTZtUXzHMF
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { IProductReview } from "@/types/product"


export default function Component({product_id, reviews}:{product_id: string, reviews: IProductReview[]}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Textarea className="min-h-[100px]" placeholder="Write your comment..." />
          <Button>Submit</Button>
        </div>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {review.user && <div className="font-semibold">@{review.user.username}</div>}
                  <div className="text-gray-500 text-xs dark:text-gray-400">5 months ago</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">5 stars</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Reply</div>
                </div>
              </div>
              <div>{review.review}</div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}