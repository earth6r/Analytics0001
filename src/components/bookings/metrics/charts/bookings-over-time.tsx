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
const chartData = [
    { date: "2024-07-15", "Tour": 400, "Call": 200 },
    { date: "2024-07-16", "Tour": 300, "Call": 400 },
    { date: "2024-07-17", "Tour": 300, "Call": 200 },
    { date: "2024-07-18", "Tour": 200, "Call": 400 },
    { date: "2024-07-19", "Tour": 200, "Call": 200 },
    { date: "2024-07-20", "Tour": 100, "Call": 300 },
]

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

const BookingsOverTime = () => {
    const { interval } = useInterval();

    const bookingsCount =
        api.bookings.bookingsCount.useQuery(
            undefined,
            {
                refetchInterval: interval,
            },
        );

    const bookingsOverTime = api.bookings.bookingsOverTime.useQuery(
        undefined,
        {
            refetchInterval: interval,
        },
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bookings</CardTitle>
                <CardDescription>
                    {bookingsCount.data?.toString()} Total Bookings
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={bookingsOverTime.data}>
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

export default BookingsOverTime;
