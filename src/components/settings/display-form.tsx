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
import { useInterval } from "@/contexts/IntervalContext";
import { useEffect } from "react";
import { toastErrorStyle, toastSuccessStyle } from "@/lib/toast-styles";
import { api } from "@/utils/api";
import { useUser } from "@/contexts/UserContext";

const FormSchema = z.object({
  interval: z.string().nullable(),
  timezone: z.string().min(1, {
    message: "timezone must be at least 1 characters.",
  }),
});

// TODO: when updating display form or any other setting, need to call api_utils.refetch for all settings query
// TODO: make a useUserSettings context
const DisplayForm = () => {
  const { interval, timezone } = useInterval();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      interval: "",
      timezone: "America/New_York",
    },
  });

  useEffect(() => {
    if (interval === false || interval === null) {
      form.setValue("interval", "");
      return;
    }

    form.setValue("interval", interval.toString());
  }, [form, interval]);

  useEffect(() => {
    form.setValue("timezone", timezone);
  }, [form, timezone]);

  const updateUserTimezone = api.userSettings.updateUserTimezone.useMutation();
  const updateUserInterval = api.userSettings.updateUserInterval.useMutation();

  const { email } = useUser();

  useEffect(() => {
    // TODO: change this logic to be completely from useUser
    const authenticatedData = JSON.parse(
      localStorage.getItem("authenticated") ?? "{}",
    );
    if (
      !authenticatedData.authenticated ||
      authenticatedData.expires < new Date().getTime() ||
      !localStorage.getItem("email")
    ) {
      window.location.href = "/";
    }
  }, [email]);

  const api_utils = api.useUtils();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { interval, timezone } = data;

    if (interval && isNaN(parseInt(interval))) {
      toast({
        title: "Invalid Interval",
        description: "Interval must be a number.",
        className: toastErrorStyle,
      });
      return;
    }

    await updateUserTimezone.mutateAsync({
      email: email as string,
      timezone: timezone,
    });

    await updateUserInterval.mutateAsync({
      email: email as string,
      interval: interval ? parseInt(interval) : null,
    });

    await api_utils.userSettings.getUserSettings.refetch();

    toast({
      title: "Display Settings Updated",
      description: "Display Settings has been updated successfully.",
      className: toastSuccessStyle,
    });
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
                  {/* @ts-expect-error TODO: Fix type */}
                  <Input placeholder="3" value={form.watch("interval") || ""} {...field} />
                </FormControl>
                {form.watch("interval") !== "" && <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.setValue("interval", "")}
                >
                  No Interval
                </Button>}
              </div>
              <FormDescription>
                This is refresh interval for the dashboard data in seconds.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <div className="flex flex-row items-center space-x-2">
                <FormControl>
                  <Input placeholder="America/New_York" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.setValue("timezone",
                    Intl.DateTimeFormat().resolvedOptions().timeZone
                  )}
                >
                  Local Timezone
                </Button>
              </div>
              <FormDescription>
                This is the timezone in which times will be formatted.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update Display Preferences</Button>
      </form>
    </Form>
  );
};

export default DisplayForm;
