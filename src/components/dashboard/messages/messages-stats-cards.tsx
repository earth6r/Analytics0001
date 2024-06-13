import MessageGroupCountsStatsCard from "@/components/dashboard/messages/message-groups-count";
import TotalMessagesStatsCard from "@/components/dashboard/messages/total-messages-stats-card";
import TotalUniqueUsersStatsCard from "@/components/dashboard/messages/total-unique-users-stats-card";
import UnansweredMessageStatsCard from "@/components/dashboard/messages/unanswered-messages-stats-card";
import InstagramMessagesCountStatsCard from "@/components/dashboard/messages/instagram-messages-count-stats-card";

const MessagesStatCards = () => {
  return (
    <div className="grid grid-cols-1 gap-6 pl-6 pr-6 pt-2 md:grid-cols-2 lg:grid-cols-5">
      <TotalMessagesStatsCard />
      <UnansweredMessageStatsCard />
      <MessageGroupCountsStatsCard />
      <InstagramMessagesCountStatsCard />
      <TotalUniqueUsersStatsCard />
    </div>
  );
};

export default MessagesStatCards;
