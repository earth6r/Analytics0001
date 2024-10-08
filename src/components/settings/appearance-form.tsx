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
import useColor from "@/hooks/use-color";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { toastSuccessStyle } from "@/lib/toast-styles";

const FormSchema = z.object({});

const AppearanceForm = () => {
  const { color, setColor, theme, setTheme } = useColor();

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
      className: toastSuccessStyle,
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
              <div className="flex flex-row items-center space-x-2">
                <Switch
                  checked={theme === "dark"}
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                />
                {theme !== "system" && <Button
                  onClick={() => {
                    setTheme("system");
                  }}
                  variant="outline"
                  type="button"
                >
                  Use System
                </Button>}
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
                <div className={cn(color === "default" && "border-2 border-black dark:border-white rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-black hover:bg-slate-600 dark:bg-white dark:hover:bg-slate-300" onClick={
                    () => {
                      setColor('default')
                    }
                  } />
                </div>
                <div className={cn(color === "red" && "border-2 border-red-500 rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-red-500 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700" onClick={
                    () => {
                      setColor('red')
                    }
                  } />
                </div>
                <div className={cn(color === "blue" && "border-2 border-blue-500 rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-700" onClick={
                    () => {
                      setColor('blue')
                    }
                  } />
                </div>
                <div className={cn(color === "green" && "border-2 border-green-500 rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-green-500 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700" onClick={
                    () => {
                      setColor('green')
                    }
                  } />
                </div>
                <div className={cn(color === "orange" && "border-2 border-orange-500 rounded-lg p-[1px] min-w-fit inline-block")}>
                  <Button className="bg-orange-500 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-700" onClick={
                    () => {
                      setColor('orange')
                    }
                  } />
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
