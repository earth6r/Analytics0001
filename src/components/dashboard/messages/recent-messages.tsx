import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import MessageItem from "@/components/dashboard/messages/message-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";

const RecentMessages = () => {
  const { interval } = useInterval();

  const recentMessages = api.post.getRecentMessages.useQuery(
    {},
    {
      refetchInterval: interval,
    },
  );
  const getMessagesCountThisMonth = api.post.getMessagesThisMonth.useQuery(
    {},
    {
      refetchInterval: interval,
    },
  );

  return (
    <Card className="mt-6 h-[450px] w-full shadow lg:mt-0 lg:w-2/5">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Messages</CardTitle>
          <div>
            {getMessagesCountThisMonth.isLoading ||
            getMessagesCountThisMonth.isError ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <CardDescription>
                {`There are ${getMessagesCountThisMonth.data ?? 0} messages this month`}
              </CardDescription>
            )}
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
        {recentMessages.isLoading || recentMessages.isError ? (
          <div className="space-y-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="space-y-5">
            {(recentMessages.data ?? []).map((message, index) => (
              <MessageItem key={index} message={message} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMessages;
