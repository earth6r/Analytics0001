"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { Switch } from "./ui/switch"
import ToggleTheme from "./toggle-theme"

const FormSchema = z.object({
    // name: z.string().min(2, {
    //     message: "name must be at least 2 characters.",
    // }),
})

const AppearanceForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            // name: "",
        },
    })

    useEffect(() => {
        // const name = localStorage.getItem("name") ?? ""
        // form.setValue("name", name);
    }, [form]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "Appearance Updated",
            description: "Your preferences has been updated successfully.",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
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
                <Button type="submit">Update Preferences</Button>
            </form>
        </Form>
    )
}

export default AppearanceForm;
