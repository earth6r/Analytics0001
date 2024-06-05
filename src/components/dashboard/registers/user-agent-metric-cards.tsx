import { useInterval } from "@/contexts/IntervalContext";
import ProgressChart from "@/components/common/progress-chart";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/utils/api";

const UserAgentMetricCards = () => {
  const { interval } = useInterval();

  const deviceInfoStats = api.post.getDeviceInfoStats.useQuery(
    // @ts-expect-error - fix this
    {},
    {
      refetchInterval: interval,
    },
  );
  const browserInfoStats = api.post.getBrowserInfoStats.useQuery(
    // @ts-expect-error - fix this
    {},
    {
      refetchInterval: interval,
    },
  );
  const languageStats = api.post.getLanguageStats.useQuery(
    // @ts-expect-error - fix this
    {},
    {
      refetchInterval: interval,
    },
  );
  const ipAddressStats = api.post.getIpAddressStats.useQuery(
    // @ts-expect-error - fix this
    {},
    {
      refetchInterval: interval,
    },
  );
  const cityStats = api.post.getCityStats.useQuery(
    // @ts-expect-error - fix this
    {},
    {
      refetchInterval: interval,
    },
  );

  return (
    <div className="flex flex-col pb-6 pl-6 pr-6 md:flex-row md:space-x-6">
      {/* TODO: make each card its own component */}
      <Card className="min-h-80 md:w-1/5">
        <CardHeader>
          <CardTitle>Device Info Stats</CardTitle>
          <CardDescription>Register Device Information Stats</CardDescription>
        </CardHeader>
        <ScrollArea className="flex max-h-48 flex-col">
          <ProgressChart data={deviceInfoStats} />
        </ScrollArea>
      </Card>
      <Card className="min-h-80 mt-6 md:mt-0 md:w-1/5">
        <CardHeader>
          <CardTitle>Browser Info Stats</CardTitle>
          <CardDescription>Register Browser Info Stats</CardDescription>
        </CardHeader>
        <ScrollArea className="flex max-h-48 flex-col">
          <ProgressChart data={browserInfoStats} />
        </ScrollArea>
      </Card>
      <Card className="max-h-80 min-h-80 mt-6 md:mt-0 md:w-1/5 overflow-hidden">
        <CardHeader>
          <CardTitle>Language Stats</CardTitle>
          <CardDescription>Register Language Stats</CardDescription>
        </CardHeader>
        <ScrollArea className="flex max-h-48 flex-col">
          <ProgressChart data={languageStats} />
        </ScrollArea>
      </Card>
      <Card className="min-h-80 mt-6 md:mt-0 md:w-1/5">
        <CardHeader>
          <CardTitle>IP Address Stats</CardTitle>
          <CardDescription>Register IP Address Stats</CardDescription>
        </CardHeader>
        <ScrollArea className="flex max-h-48 flex-col">
          <ProgressChart data={ipAddressStats} />
        </ScrollArea>
      </Card>
      <Card className="min-h-80 mt-6 md:mt-0 md:w-1/5">
        <CardHeader>
          <CardTitle>City Stats</CardTitle>
          <CardDescription>Register City Stats</CardDescription>
        </CardHeader>
        <ScrollArea className="flex max-h-48 flex-col">
          <ProgressChart data={cityStats} />
        </ScrollArea>
      </Card>
    </div>
  );
};

export default UserAgentMetricCards;
