/**
 * v0 by Vercel.
 * @see https://v0.dev/t/srTZtUXzHMF
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { IProductReview } from "@/types/product"

export default function Component({product_id, reviews}:{product_id: number, reviews: IProductReview[]}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Textarea className="min-h-[100px]" placeholder="Write your comment..." />
          <Button>Submit</Button>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 border">
              <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div className="grid gap-1.5">
              <div className="flex items-center gap-2">
                <div className="font-semibold">@iamwillpursell</div>
                <div className="text-gray-500 text-xs dark:text-gray-400">5 months ago</div>
              </div>
              <div>
                I really love the ecosystem Vercel is creating. The way each component can be added and modified with
                ease really makes these tools attractive.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}