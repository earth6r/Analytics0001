"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";
import { Skeleton } from "@/components/ui/skeleton";
import CircularQuestionMarkTooltip from "@/components/common/circular-question-mark-tooltip";

// TODO: move to utils
export const buyingProgressTypeToLabel = {
    "escrow-deposit": "Escrow Deposit",
    "download-documents": "Download Documents",
    "schedule-closing": "Schedule Closing",
    "full-payment": "Full Payment",
    completed: "Completed",
};

const BuyingProgressChart = () => {
    const { interval } = useInterval();
    const getBuyingProgressBarChart =
        api.customer.getBuyingProgressBarChart.useQuery(
            undefined,
            {
                refetchInterval: interval,
            },
        );

    const formattedData = getBuyingProgressBarChart.data?.map((item) => ({
        ...item,
        // @ts-expect-error - fix this
        name: buyingProgressTypeToLabel[item.name],
    }));

    return (
        <Card className="shadow">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Buying Progress</CardTitle>
                    <CircularQuestionMarkTooltip label="Each value is the user's current step they need to do. Note: Escrow Deposit counts are representative of a user who has not bought a single property yet." />
                </div>
                <CardDescription>Customers Buying Progress</CardDescription>
            </CardHeader>
            <ResponsiveContainer height={350}>
                {formattedData ? (
                    <BarChart data={formattedData}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Bar
                            dataKey="total"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                            barSize={100}
                        />
                    </BarChart>
                ) : (
                    <div className="h-full w-full pb-6 pl-6 pr-6">
                        <Skeleton className="h-full w-full" />
                    </div>
                )}
            </ResponsiveContainer>
        </Card>
    );
};

export default BuyingProgressChart;
