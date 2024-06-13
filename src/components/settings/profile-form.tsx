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

const FormSchema = z.object({
    profilePictureUrl: z.string().min(2, {
        message: "profilePictureUrl must be at least 2 characters.",
    }),
});

const ProfileForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            profilePictureUrl: "",
        },
    });

    useEffect(() => {
        const profilePictureUrl =
            localStorage.getItem("profilePictureUrl") ?? "";
        form.setValue("profilePictureUrl", profilePictureUrl);
    }, [form]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const { profilePictureUrl } = data;

        localStorage.setItem("profilePictureUrl", profilePictureUrl);

        toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
        });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
            >
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
                <Button type="submit">Update Profile</Button>
            </form>
        </Form>
    );
};

export default ProfileForm;
