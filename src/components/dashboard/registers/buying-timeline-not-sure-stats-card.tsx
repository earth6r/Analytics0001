import { api } from "@/utils/api";
import StatCard from "@/components/common/stat-card";
import { useInterval } from "@/contexts/IntervalContext";
import { UserIcon } from "lucide-react";

const BuyingTimelineNotSureStatsCard = () => {
  const { interval } = useInterval();

  const buyingTimelineNowCount =
    api.post.getBuyingTimelineNotSureCount.useQuery(
      {},
      {
        refetchInterval: interval,
      },
    );
  const buyingTimelineNowCountDelta =
    api.post.getBuyingTimelineNotSureCountDelta.useQuery(
      {},
      {
        refetchInterval: interval,
      },
    );

  return (
    <StatCard
      title={buyingTimelineNowCount.data?.toString()}
      description="Buying Timeline Not Sure Count"
      deltaValue={buyingTimelineNowCountDelta.data}
      icon={<UserIcon className="h-6 w-6 text-muted-foreground" />}
    />
  );
};

export default BuyingTimelineNotSureStatsCard;
