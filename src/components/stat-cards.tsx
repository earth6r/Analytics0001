import TotalMessagesStatsCard from "@/components/total-messages-stats-card";
import TotalUniqueRegisteredUsersCount from "@/components/total-unique-registered-users-count";
import UnansweredMessageStatsCard from "@/components/unanswered-messages-stats-card";
import TotalUniqueUsersStatsCard from "@/components/total-unique-users-stats-card";

const StatCards = () => {
    return (
        <div className="grid grid-cols-1 gap-6 pl-6 pr-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
            <TotalMessagesStatsCard />
            <TotalUniqueRegisteredUsersCount />
            <UnansweredMessageStatsCard />
            <TotalUniqueUsersStatsCard />
        </div>
    );
};

export default StatCards;
