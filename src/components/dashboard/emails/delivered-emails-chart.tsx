import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useInterval } from "@/contexts/IntervalContext";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { api } from "@/utils/api";

const DeliveredEmailsChart = () => {
    const { interval } = useInterval();

    const getStats = api.email.getStats.useQuery(
        undefined,
        {
            refetchInterval: interval,
        },
    );

    const formattedData = getStats.data?.map((item: any) => {
        return {
            name: item.date,
            ["Delivered Emails"]: item.stats[0].metrics.delivered,
        };
    });

    return (
        <Card className="h-[450px] w-full shadow">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Delivered Emails</CardTitle>
                    <div>
                        <CardDescription>Delivered emails over time</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <ResponsiveContainer height={350} className="p-1">
                <LineChart
                    width={500}
                    height={300}
                    data={formattedData}
                    margin={{
                        top: 5,
                        right: 40,
                        left: -20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="Delivered Emails"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default DeliveredEmailsChart;
