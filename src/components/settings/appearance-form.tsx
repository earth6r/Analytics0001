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

const FormSchema = z.object({});

const AppearanceForm = () => {
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
              <div>
                <Button className="bg-black" onClick={
                  () => {
                    document.body.classList.remove('theme-red', 'theme-red', 'theme-blue', 'theme-green', 'theme-orange');
                  }
                }>Zinc</Button>
                <Button className="bg-red-500" onClick={
                  () => {
                    document.body.classList.remove('theme-red', 'theme-red', 'theme-blue', 'theme-green', 'theme-orange');
                    document.body.classList.add('theme-red');
                  }
                }>Red</Button>
                <Button className="bg-blue-500" onClick={
                  () => {
                    document.body.classList.remove('theme-red', 'theme-red', 'theme-blue', 'theme-green', 'theme-orange');
                    document.body.classList.add('theme-blue');
                  }
                }>Blue</Button>
                <Button className="bg-green-500" onClick={
                  () => {
                    document.body.classList.remove('theme-red', 'theme-red', 'theme-blue', 'theme-green', 'theme-orange');
                    document.body.classList.add('theme-green');
                  }
                }>Green</Button>
                <Button className="bg-orange-500" onClick={
                  () => {
                    document.body.classList.remove('theme-red', 'theme-red', 'theme-blue', 'theme-green', 'theme-orange');
                    document.body.classList.add('theme-orange');
                  }
                }>Orange</Button>
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
    </Form>
  );
};

export default AppearanceForm;
