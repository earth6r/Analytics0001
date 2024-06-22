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
import ToggleTheme from "@/components/settings/toggle-theme";
import { cn } from "@/lib/utils";
import useColor from "@/hooks/use-color";

const FormSchema = z.object({});

const AppearanceForm = () => {
  const { color, setColor } = useColor();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  function onSubmit(
    // data: z.infer<typeof FormSchema>
  ) {
    toast({
      title: "Appearance Updated",
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
          render={({ }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <div>
                <ToggleTheme />
              </div>
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          // @ts-expect-error - fix this
          name="name"
          render={({ }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <div className="flex flex-row items-center space-x-4">
                <div className={cn(color === "default" && "border-2 border-black rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-black" onClick={
                    () => {
                      setColor('default')
                    }
                  }>Zinc</Button>
                </div>
                <div className={cn(color === "red" && "border-2 border-black rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-red-500" onClick={
                    () => {
                      setColor('red')
                    }
                  }>Red</Button>
                </div>
                <div className={cn(color === "blue" && "border-2 border-black rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-blue-500" onClick={
                    () => {
                      setColor('blue')
                    }
                  }>Blue</Button>
                </div>
                <div className={cn(color === "green" && "border-2 border-black rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-green-500" onClick={
                    () => {
                      setColor('green')
                    }
                  }>Green</Button>
                </div>
                <div className={cn(color === "orange" && "border-2 border-black rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-orange-500" onClick={
                    () => {
                      setColor('orange')
                    }
                  }>Orange</Button>
                </div>
              </div>
              <FormDescription>
                Select the color for the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Preferences</Button>
      </form>
    </Form >
  );
};

export default AppearanceForm;
