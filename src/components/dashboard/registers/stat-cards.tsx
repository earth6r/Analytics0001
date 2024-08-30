import BuyingTimelineNotSureStatsCard from "@/components/dashboard/registers/buying-timeline-not-sure-stats-card";
import BuyingTimelineNowStatsCard from "@/components/dashboard/registers/buying-timeline-now-stats-card";
import BuyingTimelineOneToThreeMonthsStatsCard from "@/components/dashboard/registers/buying-timeline-one-to-three-months-stats-card";
import TotalUniqueRegisteredUsersCount from "@/components/dashboard/registers/total-unique-registered-users-count";

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
