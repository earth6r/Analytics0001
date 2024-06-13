import { api } from "@/utils/api";
import StatCard from "@/components/common/stat-card";
import { useInterval } from "@/contexts/IntervalContext";
import { UserIcon } from "lucide-react";

const TotalUniqueUsersStatsCard = () => {
    const { interval } = useInterval();

    const totalUniqueUsersCount = api.post.getTotalUniqueUsers.useQuery(
        // @ts-expect-error - fix this
        {},
        {
            refetchInterval: interval,
        },
    );
    const totalUniqueUsersCountDelta =
        api.post.getTotalUniqueUsersDelta.useQuery(
            // @ts-expect-error - fix this
            {},
            {
                refetchInterval: interval,
            },
        );

    return (
        <StatCard
            title={totalUniqueUsersCount.data?.toString()}
            description="Total Unique Users"
            deltaValue={totalUniqueUsersCountDelta.data}
            icon={<UserIcon className="h-6 w-6 text-muted-foreground" />}
        />
    );
};

export default TotalUniqueUsersStatsCard;
