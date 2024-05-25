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
    const getTotalMessagesCountDelta = api.post.getTotalMessagesCountDelta.useQuery(
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
                title={totalMessagesCount.data?.toString()}
                description="Total Messages"
                deltaValue={getTotalMessagesCountDelta.data}
                icon={<BookUserIcon className="h-6 w-6 text-muted-foreground" />}
            />
            <StatCard
                title={unansweredMessagesCount.data?.toString()}
                description="Unanswered Messages"
                deltaValue={5}
                icon={<MessageCircle className="h-6 w-6 text-muted-foreground" />}
            />
            <StatCard
                title={totalUniqueRegisteredUsersCount.data?.toString()}
                description="Total Unique Registered Users"
                deltaValue={5}
                icon={<BookOpenCheckIcon className="h-6 w-6 text-muted-foreground" />}
            />
            <StatCard
                title={totalUniqueUsersCount.data?.toString()}
                description="Total Unique Users"
                deltaValue={5}
                icon={<UserIcon className="h-6 w-6 text-muted-foreground" />}
            />
        </div>
    );
};

export default StatCards;
