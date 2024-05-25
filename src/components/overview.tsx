import StatCards from "@/components/stat-cards";
import NumberOfMessagesChart from "@/components/number-of-messages-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MessageItem from "./message-item";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";
import { Skeleton } from "@/components/ui/skeleton";

const Overview = () => {
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
            <StatCards />
            <div className="flex flex-col lg:flex-row items-center p-6 lg:space-x-6">
                <NumberOfMessagesChart />
                {/* TODO: make this its own component */}
                <Card className="w-full lg:w-2/5 mt-6 lg:mt-0 shadow h-[450px]">
                    <CardHeader>
                        <CardTitle>Recent Messages</CardTitle>
                        <div>
                            {(getMessagesCountThisMonth.isLoading || getMessagesCountThisMonth.isError) ? <Skeleton className="w-full h-5" /> : <CardDescription>
                                {`There are ${getMessagesCountThisMonth.data ?? 0} messages this month`}
                            </CardDescription>}
                        </div>
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
        </div>
    );
};

export default Overview;
