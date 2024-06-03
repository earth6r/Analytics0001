import { api } from "@/utils/api";
import StatCard from "@/components/common/stat-card";
import { useInterval } from "@/contexts/IntervalContext";
import { BookUserIcon } from "lucide-react";

const TotalMessagesStatsCard = () => {
  const { interval } = useInterval();

  const totalMessagesCount = api.post.getTotalMessagesCount.useQuery(
   // @ts-expect-error - fix this
    {},
    {
      refetchInterval: interval,
    },
  );
  const getTotalMessagesCountDelta =
    api.post.getTotalMessagesCountDelta.useQuery(
      // @ts-expect-error - fix this
      {},
      {
        refetchInterval: interval,
      },
    );

  return (
    <StatCard
      title={totalMessagesCount.data?.toString()}
      description="Total Messages"
      deltaValue={getTotalMessagesCountDelta.data}
      icon={<BookUserIcon className="h-6 w-6 text-muted-foreground" />}
    />
  );
};

export default TotalMessagesStatsCard;
