import StatCards from "@/components/stat-cards";
import NumberOfMessagesChart from "@/components/number-of-messages-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MessageItem from "./message-item";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";

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
            <div className="flex flex-row items-center p-6 space-x-6">
                <NumberOfMessagesChart />
                <Card className="w-2/5 shadow h-[450px]">
                    <CardHeader>
                        <CardTitle>Recent Messages</CardTitle>
                        <CardDescription>
                            {`There are ${getMessagesCountThisMonth.data ?? 0} messages this month`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {(recentMessages.data ?? []).map((message, index) => (
                            <MessageItem key={index} message={message} />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Overview;
