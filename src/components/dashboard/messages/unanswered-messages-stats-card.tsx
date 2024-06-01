import { api } from "@/utils/api";
import StatCard from "@/components/common/stat-card";
import { useInterval } from "@/contexts/IntervalContext";
import { MessageCircle } from "lucide-react";

const UnansweredMessageStatsCard = () => {
  const { interval } = useInterval();

  const unansweredMessagesCount = api.post.getUnansweredMessagesCount.useQuery(
    {},
    {
      refetchInterval: interval,
    },
  );
  const unansweredMessagesCountDelta =
    api.post.getUnansweredMessagesCountDelta.useQuery(
      {},
      {
        refetchInterval: interval,
      },
    );

  return (
    <StatCard
      title={unansweredMessagesCount.data?.toString()}
      description="Unanswered Messages"
      deltaValue={unansweredMessagesCountDelta.data}
      icon={<MessageCircle className="h-6 w-6 text-muted-foreground" />}
    />
  );
};

export default UnansweredMessageStatsCard;
