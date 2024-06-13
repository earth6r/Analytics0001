import { api } from "@/utils/api";
import StatCard from "@/components/common/stat-card";
import { useInterval } from "@/contexts/IntervalContext";
import { MessageCircle } from "lucide-react";

const InstagramMessagesCountStatsCard = () => {
    const { interval } = useInterval();

    const instagramMessagesCount = api.post.getInstagramMessagesCount.useQuery(
        // @ts-expect-error - fix this
        {},
        {
            refetchInterval: interval,
        },
    );
    const instagramMessagesCountDelta =
        api.post.getInstagramMessagesCountDelta.useQuery(
            // @ts-expect-error - fix this
            {},
            {
                refetchInterval: interval,
            },
        );

    return (
        <StatCard
            title={instagramMessagesCount.data?.toString()}
            description="Instagram Messages Count"
            deltaValue={instagramMessagesCountDelta.data}
            icon={<MessageCircle className="h-6 w-6 text-muted-foreground" />}
        />
    );
};

export default InstagramMessagesCountStatsCard;
