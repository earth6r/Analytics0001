import { api } from "@/utils/api";
import StatCard from "@/components/common/stat-card";
import { useInterval } from "@/contexts/IntervalContext";
import { MessageCircle } from "lucide-react";

const MessageGroupCountsStatsCard = () => {
  const { interval } = useInterval();

  const messageGroupsCount = api.post.getMessageGroupsCount.useQuery(
    {},
    {
      refetchInterval: interval,
    },
  );
  const messageGroupsCountDelta = api.post.getMessageGroupsCountDelta.useQuery(
    {},
    {
      refetchInterval: interval,
    },
  );

  return (
    <StatCard
      title={messageGroupsCount.data?.toString()}
      description="Message Groups Count"
      deltaValue={messageGroupsCountDelta.data}
      icon={<MessageCircle className="h-6 w-6 text-muted-foreground" />}
    />
  );
};

export default MessageGroupCountsStatsCard;
