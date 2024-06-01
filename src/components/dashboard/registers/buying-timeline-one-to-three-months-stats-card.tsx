import { api } from "@/utils/api";
import StatCard from "@/components/common/stat-card";
import { useInterval } from "@/contexts/IntervalContext";
import { UserIcon } from "lucide-react";

const BuyingTimelineOneToThreeMonthsStatsCard = () => {
    const { interval } = useInterval();

    const buyingTimelineOneToThreeMonthsCount = api.post.getBuyingTimelineOneToThreeMonthsCount.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const buyingTimelineOneToThreeMonthsCountDelta = api.post.getBuyingTimelineOneToThreeMonthsCountDelta.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );

    return (
        <StatCard
            title={buyingTimelineOneToThreeMonthsCount.data?.toString()}
            description="Buying Timeline 1-3 Months Count"
            deltaValue={buyingTimelineOneToThreeMonthsCountDelta.data}
            icon={<UserIcon className="h-6 w-6 text-muted-foreground" />}
        />
    );
}

export default BuyingTimelineOneToThreeMonthsStatsCard;
