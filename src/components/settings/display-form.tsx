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
import { useInterval } from "@/contexts/IntervalContext"

const FormSchema = z.object({
    interval: z.string().min(1, {
        message: "interval must be at least 1 characters.",
    })
})

const DisplayForm = () => {
    const { interval, setIntervalWithLocalStorage } = useInterval();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            interval: "",
        },
    })

    useEffect(() => {
        form.setValue("interval", interval.toString());
    }, [form, interval]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const { interval } = data;

        if (isNaN(parseInt(interval))) {
            toast({
                title: "Invalid Interval",
                description: "Interval must be a number.",
            })
            return;
        }

        setIntervalWithLocalStorage(parseInt(interval));

        toast({
            title: "Interval Updated",
            description: "Interval has been updated successfully.",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="interval"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interval</FormLabel>
                            <div className="flex flex-row items-center space-x-2">
                                <FormControl>
                                    <Input placeholder="3" {...field} />
                                </FormControl>
                                <Button type="button" variant="outline" onClick={() => setIntervalWithLocalStorage(false)}>No Interval</Button>
                            </div>
                            <FormDescription>
                                This is refresh interval for the dashboard data in seconds.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Update Display Preferences</Button>
            </form>
        </Form>
    )
}

export default DisplayForm;
