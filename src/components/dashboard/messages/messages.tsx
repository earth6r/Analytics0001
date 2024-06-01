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
import {
    Line, LineChart, ResponsiveContainer,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from "recharts";

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
    const cumulativeMessages = api.post.getCumulativeMessages.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const messagesByWeek = api.post.getMessagesByWeek.useQuery(
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
                <Card className="w-full lg:w-2/5 lg:mt-0 shadow h-[450px]">
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
                    <ResponsiveContainer height={350} className="p-1">
                        <LineChart
                            width={500}
                            height={300}
                            data={cumulativeMessages.data}
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
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="w-full lg:w-3/5 lg:mt-0 shadow h-[450px]">
                    <CardHeader className="flex flex-row items-center">
                        <div className="grid gap-2">
                            <CardTitle>Messages By Week</CardTitle>
                            <div>
                                <CardDescription>
                                    Messages sent by week
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <ResponsiveContainer height={350} className="p-1">
                        <LineChart
                            width={500}
                            height={300}
                            data={messagesByWeek.data}
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
                            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default Messages;
