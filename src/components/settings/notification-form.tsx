"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

const FormSchema = z.object({});

const NotificationForm = () => {
  const [toastEnabled, setToastEnabled] = useState(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (localStorage.getItem("toast") === "false") {
      setToastEnabled(false);
    }
  }, []);

  function onSubmit(
    // data: z.infer<typeof FormSchema>
  ) {
    toast({
      title: "Notifications Updated",
      description: "Your preferences has been updated successfully.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          // @ts-expect-error - fix this
          name="name"
          render={({
            // field
          }) => (
            <FormItem>
              <FormLabel>Toast Message</FormLabel>
              <FormDescription>
                Enable or disable toast messages.
              </FormDescription>
              <Switch
                defaultChecked={true}
                checked={toastEnabled}
                onClick={() => {
                  const newToastState = !toastEnabled;
                  localStorage.setItem("toast", newToastState.toString());
                  setToastEnabled(newToastState);
                  toast({
                    title: "Toast Message",
                    description: `This is a toast message. You will ${newToastState ? "keep seeing these." : "no longer see these again."}`,
                  });
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Preferences</Button>
      </form>
    </Form>
  );
};

export default NotificationForm;
