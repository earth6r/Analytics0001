import TotalMessagesStatsCard from "@/components/total-messages-stats-card";
import UnansweredMessageStatsCard from "@/components/unanswered-messages-stats-card";
import MessageGroupCountsStatsCard from "@/components/message-groups-count";
import InstagramMessagesCountStatsCard from "@/components/instagram-messages-count-stats-card";

const MessagesStatCards = () => {
    return (
        <div className="grid grid-cols-1 gap-6 pl-6 pr-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
            <TotalMessagesStatsCard />
            <UnansweredMessageStatsCard />
            <MessageGroupCountsStatsCard />
            <InstagramMessagesCountStatsCard />
        </div>
    );
};

export default MessagesStatCards;
