import { useInterval } from "@/contexts/IntervalContext";
import ProgressChart from "@/components/progress-chart";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/utils/api";

const UserAgentMetricCards = () => {
    const { interval } = useInterval();

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
        <div className="pl-6 pr-6 pb-6 flex flex-col md:flex-row md:space-x-6">
            {/* TODO: make each card its own component */}
            <Card className="w-1/5 min-h-80">
                <CardHeader>
                    <CardTitle>Device Info Stats</CardTitle>
                    <CardDescription>
                        Register Device Information Stats
                    </CardDescription>
                </CardHeader>
                <ScrollArea className="flex flex-col max-h-48">
                    <ProgressChart data={deviceInfoStats} />
                </ScrollArea>
            </Card>
            <Card className="w-1/5 min-h-80">
                <CardHeader>
                    <CardTitle>Browser Info Stats</CardTitle>
                    <CardDescription>
                        Register Browser Info Stats
                    </CardDescription>
                </CardHeader>
                <ScrollArea className="flex flex-col max-h-48">
                    <ProgressChart data={browserInfoStats} />
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
                    <ProgressChart data={languageStats} />
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
                    <ProgressChart data={ipAddressStats} />
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
                    <ProgressChart data={cityStats} />
                </ScrollArea>
            </Card>
        </div>
    );
};

export default UserAgentMetricCards;
