import { Bar, BarChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useInterval } from "@/contexts/IntervalContext"
import { api } from "@/utils/api"

const chartConfig = {
    bookings: {
        label: "Bookings",
    },
    "Property Tour": {
        label: "Property Tour",
        color: "hsl(var(--chart-1))",
    },
    "Phone Call": {
        label: "Phone Call",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const NoShowBookingsOverTime = () => {
    const { interval } = useInterval();

    const noShowBookingsOverTime = api.bookings.noShowBookingsOverTime.useQuery(
        undefined,
        {
            refetchInterval: interval,
        },
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>No Show Bookings</CardTitle>
                <CardDescription>
                    No Show bookings over time
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={noShowBookingsOverTime.data}>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => {
                                return new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <Bar
                            dataKey="Tour"
                            stackId="a"
                            fill="var(--chart-1)"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="Call"
                            stackId="a"
                            fill="var(--chart-2)"
                            radius={[4, 4, 0, 0]}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent />
                            }
                            cursor={false}
                            defaultIndex={1}
                            labelFormatter={(label) => {
                                return new Date(label).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                            }}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default NoShowBookingsOverTime;
