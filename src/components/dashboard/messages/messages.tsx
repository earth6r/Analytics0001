import MessagesStatCards from "@/components/dashboard/messages/messages-stats-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NumberOfMessagesChart from "@/components/dashboard/messages/number-of-messages-chart";
import MessageItem from "@/components/dashboard/messages/message-item";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const data = [
    {
        name: 'Page A',
        pv: 2400,
    },
    {
        name: 'Page B',
        pv: 1398,
    },
    {
        name: 'Page C',
        pv: 9800,
    },
    {
        name: 'Page D',
        pv: 3908,
    },
    {
        name: 'Page E',
        pv: 4800,
    },
    {
        name: 'Page F',
        pv: 3800,
    },
    {
        name: 'Page G',
        pv: 4300,
    },
];

const Messages = () => {
    const { interval } = useInterval();
    const recentMessages = api.post.getRecentMessages.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const getMessagesCountThisMonth = api.post.getMessagesThisMonth.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );

    return (
        <div>
            <MessagesStatCards />
            <div className="flex flex-col lg:flex-row items-center p-6 lg:space-x-6">
                <NumberOfMessagesChart />
                {/* TODO: make this its own component */}
                <Card className="w-full lg:w-2/5 mt-6 lg:mt-0 shadow h-[450px]">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Recent Messages</CardTitle>
                            <div>
                                {(getMessagesCountThisMonth.isLoading || getMessagesCountThisMonth.isError) ? <Skeleton className="w-full h-5" /> : <CardDescription>
                                    {`There are ${getMessagesCountThisMonth.data ?? 0} messages this month`}
                                </CardDescription>}
                            </div>
                        </div>
                        <Button asChild size="sm" className="ml-auto gap-1">
                            <Link href="/messages">
                                View All
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {(recentMessages.isLoading || recentMessages.isError) ?
                            <div className="space-y-5">
                                <Skeleton className="w-full h-12" />
                                <Skeleton className="w-full h-12" />
                                <Skeleton className="w-full h-12" />
                                <Skeleton className="w-full h-12" />
                                <Skeleton className="w-full h-12" />
                            </div>
                            : <div className="space-y-5">
                                {(recentMessages.data ?? []).map((message, index) => (
                                    <MessageItem key={index} message={message} />
                                ))}
                            </div>
                        }
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col lg:flex-row items-center px-6 pb-6 lg:space-x-6">
                <Card className="w-full lg:w-2/5 mt-6 lg:mt-0 shadow h-[450px]">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Cumulative Messages</CardTitle>
                            <div>
                                <CardDescription>
                                    Cumulative messages over time
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <ResponsiveContainer height={350} className="p-4">
                        <LineChart width={300} height={50} data={data}>
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default Messages;
