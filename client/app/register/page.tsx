"use client";
import Lottie, { useLottie } from "lottie-react";
import { Button } from "@/components/ui/button";
import loader from "@/assets/loader-1.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { any, z } from "zod";
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
import { useContext, useEffect, useState } from "react";
import { register } from "../../Services/auth/authService";
import { login as loginHandler } from "../../Services/auth/authService";
import { redirect, usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import { toast } from "react-hot-toast";

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters long",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters long",
    }),
    confirmPassword: z.string(),
    email: z.string().email(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type PageProps = {
  switchToLogin?: () => void;
};

export default function Page({ switchToLogin }: PageProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    },
  });
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const {login } = useContext(AuthContext);

  const loaderOption = {
    animationData: loader,
    loop: open == true ? false : true,
  };


  const router = useRouter();



  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // event.preventDefault();
    try {
      setLoading(true);
      const data = await register({
        username: values.username,
        password: values.password,
        email: values.email,
      });

      if(data.message){
        setLoading(false);

        console.log(data.message);
        toast.error(data.message);
        return;
      }
      const response = await loginHandler( values.username, values.password);
      // console.log(console.log(data));
      login(response.user, response.token);
      setOpen(false);
      setLoading(false);
      toast.success("Registration successful");
      router.push("/");
    } catch (error: any) {
      setLoading(false);
      toast.error("retry again");
      console.log(error.message);
    }
  };

  return (
    <div>
      {loading ? (
        <div>
          <Lottie animationData={loader} loop={loading} />
        </div>
      ) : (
        // Your form goes here
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Register</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  {switchToLogin && (
                    <>
                      <Button onClick={switchToLogin}>Login</Button>
                      <hr />
                    </>
                  )}
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
