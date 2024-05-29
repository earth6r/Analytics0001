import StatCards from "@/components/stat-cards";
import NumberOfMessagesChart from "@/components/number-of-messages-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MessageItem from "./message-item";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";
import { Skeleton } from "@/components/ui/skeleton";
import PieChart from "./interest-chart";
import RecentRegisters from "./recent-registers";
import ProgressChart from "./progress-chart";
import { ScrollArea } from "./ui/scroll-area";

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
    const deviceInfoStats = api.post.getDeviceInfoStats.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const browserInfoStats = api.post.getBrowserInfoStats.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const languageStats = api.post.getLanguageStats.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const ipAddressStats = api.post.getIpAddressStats.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const cityStats = api.post.getCityStats.useQuery(
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
            <div className="px-6 pb-6 flex flex-col md:flex-row items-center md:space-x-6">
                <PieChart />
                <RecentRegisters />
            </div>
            <div className="pl-6 pr-6 pb-6 flex flex-col md:flex-row md:space-x-6">
                {/* TODO: make this its own component */}
                <Card className="w-1/5 min-h-80">
                    <CardHeader>
                        <CardTitle>Device Info Stats</CardTitle>
                        <CardDescription>
                            Register Device Information Stats
                        </CardDescription>
                    </CardHeader>
                    <ScrollArea className="flex flex-col max-h-48">
                        {deviceInfoStats.isLoading || deviceInfoStats.isError ? <Skeleton className="w-full h-5" /> : (
                            <ProgressChart data={deviceInfoStats.data || []} />
                        )}
                    </ScrollArea>
                </Card>
                <Card className="w-1/5 min-h-80">
                    <CardHeader>
                        <CardTitle>Browser Info Stats</CardTitle>
                        <CardDescription>
                            Register Browser Information Stats
                        </CardDescription>
                    </CardHeader>
                    <ScrollArea className="flex flex-col max-h-48">
                        {browserInfoStats.isLoading || browserInfoStats.isError ? <Skeleton className="w-full h-5" /> : (
                            <ProgressChart data={browserInfoStats.data || []} />
                        )}
                    </ScrollArea>
                </Card>
                <Card className="w-1/5 min-h-80 max-h-80 overflow-hidden">
                    <CardHeader>
                        <CardTitle>Language Stats</CardTitle>
                        <CardDescription>
                            Register Language Stats
                        </CardDescription>
                    </CardHeader>
                    <ScrollArea className="flex flex-col max-h-48">
                        {languageStats.isLoading || languageStats.isError ? <Skeleton className="w-full h-5" /> : (
                            <ProgressChart data={languageStats.data || []} />
                        )}
                    </ScrollArea>
                </Card>
                <Card className="w-1/5 min-h-80">
                    <CardHeader>
                        <CardTitle>IP Address Stats</CardTitle>
                        <CardDescription>
                            Register IP Address Stats
                        </CardDescription>
                    </CardHeader>
                    <ScrollArea className="flex flex-col max-h-48">
                        {ipAddressStats.isLoading || ipAddressStats.isError ? <Skeleton className="w-full h-5" /> : (
                            <ProgressChart data={ipAddressStats.data || []} />
                        )}
                    </ScrollArea>
                </Card>
                <Card className="w-1/5 min-h-80">
                    <CardHeader>
                        <CardTitle>City Stats</CardTitle>
                        <CardDescription>
                            Register City Stats
                        </CardDescription>
                    </CardHeader>
                    <ScrollArea className="flex flex-col max-h-48">
                        {cityStats.isLoading || cityStats.isError ? <Skeleton className="w-full h-5" /> : (
                            <ProgressChart data={cityStats.data || []} />
                        )}
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
};

export default Overview;
