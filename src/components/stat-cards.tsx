import StatCard from "@/components/stat-card";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";
import { BookOpenCheckIcon, BookUserIcon, MessageCircle, UserIcon } from "lucide-react";

const StatCards = () => {
    const { interval } = useInterval();

    const totalMessagesCount = api.post.getTotalMessagesCount.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const unansweredMessagesCount = api.post.getUnansweredMessagesCount.useQuery(
        {},
        {
            refetchInterval: interval,
        }
    );
    const totalUniqueRegisteredUsersCount = api.post.getTotalUniqueRegisteredUsersCount.useQuery(
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

    return (
        <div className="grid grid-cols-1 gap-6 pl-6 pr-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title={totalMessagesCount.data?.toString() ?? "0"}
                description="Total Messages"
                deltaMessage="+5% from last month"
                icon={<BookUserIcon className="h-6 w-6 text-muted-foreground" />}
            />
            <StatCard
                title={unansweredMessagesCount.data?.toString() ?? "0"}
                description="Unanswered Messages"
                deltaMessage="+5% from last month"
                icon={<MessageCircle className="h-6 w-6 text-muted-foreground" />}
            />
            <StatCard
                title={totalUniqueRegisteredUsersCount.data?.toString() ?? "0"}
                description="Total Unique Registered Users"
                deltaMessage="+5% from last month"
                icon={<BookOpenCheckIcon className="h-6 w-6 text-muted-foreground" />}
            />
            <StatCard
                title={totalUniqueUsersCount.data?.toString() ?? "0"}
                description="Total Unique Users"
                deltaMessage="+5% from last month"
                icon={<UserIcon className="h-6 w-6 text-muted-foreground" />}
            />
        </div>
    );
};

export default StatCards;
