import StatCard from "@/components/stat-card";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { MessageCircle, UserIcon } from "lucide-react";
import TotalMessagesStatsCard from "@/components/total-messages-stats-card";
import TotalUniqueRegisteredUsersCount from "@/components/total-unique-registered-users-count";

const StatCards = () => {
    const { interval } = useInterval();


    const unansweredMessagesCount = api.post.getUnansweredMessagesCount.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const unansweredMessagesCountDelta = api.post.getUnansweredMessagesCountDelta.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );

    const totalUniqueUsersCount = api.post.getTotalUniqueUsers.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const totalUniqueUsersCountDelta = api.post.getTotalUniqueUsersDelta.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );

    return (
        <div className="grid grid-cols-1 gap-6 pl-6 pr-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
            <TotalMessagesStatsCard />
            <StatCard
                title={unansweredMessagesCount.data?.toString()}
                description="Unanswered Messages"
                deltaValue={unansweredMessagesCountDelta.data}
                icon={<MessageCircle className="h-6 w-6 text-muted-foreground" />}
            />
            <TotalUniqueRegisteredUsersCount />
            <StatCard
                title={totalUniqueUsersCount.data?.toString()}
                description="Total Unique Users"
                deltaValue={totalUniqueUsersCountDelta.data}
                icon={<UserIcon className="h-6 w-6 text-muted-foreground" />}
            />
        </div>
    );
};

export default StatCards;
