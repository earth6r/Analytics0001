import StatCards from "@/components/stat-cards";
import NumberOfMessagesChart from "@/components/number-of-messages-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MessageItem from "./message-item";

const Overview = () => {
    return (
        <div>
            <StatCards />
            <div className="flex flex-row items-center p-6 space-x-6">
                <NumberOfMessagesChart />
                <Card className="w-2/5 shadow h-[450px]">
                    <CardHeader>
                        <CardTitle>Recent Messages</CardTitle>
                        <CardDescription>
                            There are 265 messages this month
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <MessageItem />
                        <MessageItem />
                        <MessageItem />
                        <MessageItem />
                        <MessageItem />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Overview;
