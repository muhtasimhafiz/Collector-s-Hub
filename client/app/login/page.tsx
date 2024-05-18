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
import { useContext, useEffect, useState } from "react";
import { login as loginHandler } from "../../Services/auth/authService";
import { redirect, usePathname, useRouter } from "next/navigation";
import RegisterComponent from "../register/page";
import { AuthContext } from "@/hooks/auth/AuthProvider";
import Multiloader from "@/components/ui/Multiloader";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters long",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export default function Page() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const pathname = usePathname();
  const { login, user } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const switchtoLogin = () => {
    if (isRegistered) {
      setIsRegistered(false);
    }

    if (!open) {
      setOpen(true);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // event.preventDefault();
    try {
      setLoading(true);
      const data = await loginHandler(values.username, values.password);
      login(data.user, data.token);
      // if in login page keep the modal open
      if (pathname == "/login") {
        router.push("/");
        setOpen(true);
      } else {
        setOpen(false);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error.message);
    }
  };

  return (
    <div>
      {loading == true ? (
        <div>
          <Multiloader run={loading} />
          {/* <Lottie animationData={loader} loop={loading} /> */}
        </div>
      ) : (
        // Your form goes here
        <Dialog
          open={open}
          onOpenChange={pathname != "/login" ? setOpen : undefined}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
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
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setIsRegistered(true);
                    }}
                  >
                    Register
                  </Button>
                  <hr />
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {isRegistered == true ? (
        <RegisterComponent switchToLogin={switchtoLogin} />
      ) : null}
    </div>
  );
}
