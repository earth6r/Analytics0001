"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Spinner from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { ToastAction } from "@radix-ui/react-toast";
import { useRouter } from "next/router";
import { toastErrorStyle } from "@/lib/toast-styles";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const validatePassword = api.post.validatePassword.useMutation();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await validatePassword.mutateAsync({
      email: data.email,
      password: data.password,
    });

    if (response.valid) {
      const authenticatedData = {
        authenticated: "true",
        expires: new Date().getTime() + 1000 * 60 * 60 * 24, // 24 hours
      };
      localStorage.setItem("authenticated", JSON.stringify(authenticatedData));
      await router.push("/stats");
    } else {
      toast({
        title: "Password is invalid!",
        description: "Please try again",
        action: (
          <ToastAction
            altText="Go to main page"
            onClick={() => router.push("https://www.home0001.com")}
          >
            <Button variant="outline">Looking for our main page?</Button>
          </ToastAction>
        ),
        className: toastErrorStyle,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-1/2 space-y-6 mt-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="!Ex@m413!12E" {...field} />
              </FormControl>
              <FormDescription>
                This is a given email that you can use to sign in.
              </FormDescription>
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
                <Input placeholder="!Ex@m413!12E" {...field} />
              </FormControl>
              <FormDescription>
                This is a given password that you can use to sign in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-24">
          {form.formState.isSubmitting ? <Spinner /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
