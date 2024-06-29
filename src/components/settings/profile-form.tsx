"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useEffect } from "react";
import { toastErrorStyle, toastSuccessStyle } from "@/lib/toast-styles";
import { api } from "@/utils/api";
import { useUser } from "@/contexts/UserContext";
import Spinner from "../common/spinner";

const FormSchema = z.object({
  profilePictureUrl: z.string().min(2, {
    message: "profilePictureUrl must be at least 2 characters.",
  }),
});

const ProfileForm = () => {
  const { email, profilePictureUrl, refetchProfilePictureUrl } = useUser();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profilePictureUrl: profilePictureUrl ?? "",
    },
  });

  const updateUserProfilePicture = api.userSettings.updateUserProfilePicture.useMutation();

  // useEffect to update the form value when the profilePictureUrl changes or is fetched
  useEffect(() => {
    if (profilePictureUrl) {
      form.setValue("profilePictureUrl", profilePictureUrl);
    }
  }, [form, profilePictureUrl]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { profilePictureUrl } = data;

    if (!email) {
      toast({
        title: "Error",
        description: "Please log in to update your profile.",
        className: toastErrorStyle,
      })
      return;
    }

    await updateUserProfilePicture.mutateAsync({
      url: profilePictureUrl,
      email: email,
    });

    await refetchProfilePictureUrl();

    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
      className: toastSuccessStyle,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="profilePictureUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://avatar.iran.liara.run/public"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public avatar image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-32">
          {form.formState.isSubmitting ? <Spinner /> : "Update Profile"}
          </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
