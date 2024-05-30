import TotalUniqueRegisteredUsersCount from "@/components/total-unique-registered-users-count";
import BuyingTimelineNowStatsCard from "@/components/buying-timeline-now-stats-card";
import BuyingTimelineOneToThreeMonthsStatsCard from "@/components/buying-timeline-one-to-three-months-stats-card";
import BuyingTimelineNotSureStatsCard from "@/components/buying-timeline-not-sure-stats-card";

const StatCards = () => {
    return (
        <div className="grid grid-cols-1 gap-6 pl-6 pr-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
            <TotalUniqueRegisteredUsersCount />
            <BuyingTimelineNowStatsCard />
            <BuyingTimelineOneToThreeMonthsStatsCard />
            <BuyingTimelineNotSureStatsCard />
        </div>
    );
};

export default StatCards;
