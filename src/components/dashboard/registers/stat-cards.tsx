import BuyingTimelineNotSureStatsCard from "@/components/dashboard/registers/buying-timeline-not-sure-stats-card";
import BuyingTimelineNowStatsCard from "@/components/dashboard/registers/buying-timeline-now-stats-card";
import BuyingTimelineOneToThreeMonthsStatsCard from "@/components/dashboard/registers/buying-timeline-one-to-three-months-stats-card";
import TotalUniqueRegisteredUsersCount from "@/components/dashboard/registers/total-unique-registered-users-count";
import RegisterCount from "./stat-cards/register-count";
import { useState } from "react";
import moment from "moment";

const StatCards = () => {
  // 0 to 1 month ago
  const [startDate,] = useState(moment.utc().subtract(1, 'month').toDate());
  const [endDate,] = useState(moment.utc().toDate());

  // 1-3 months ago
  const [startDateOneToThreeMonths,] = useState(moment.utc().subtract(3, 'months').toDate());
  const [endDateOneToThreeMonths,] = useState(moment.utc().subtract(1, 'months').toDate());

  // 3-6 months ago
  const [startDateThreeToSixMonths,] = useState(moment.utc().subtract(6, 'months').toDate());
  const [endDateThreeToSixMonths,] = useState(moment.utc().subtract(3, 'months').toDate());

  // 6+ months ago
  const [startDateSixToTwelveMonths,] = useState(moment.utc().subtract(60, 'months').toDate()); // 5 years ago because we don't have data that old
  const [endDateSixToTwelveMonths,] = useState(moment.utc().subtract(6, 'months').toDate());

  return (
    <div className="grid grid-cols-1 gap-6 pl-6 pr-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
      <TotalUniqueRegisteredUsersCount />
      <BuyingTimelineNowStatsCard />
      <BuyingTimelineOneToThreeMonthsStatsCard />
      <BuyingTimelineNotSureStatsCard />

      <RegisterCount startDate={startDate} endDate={endDate} description={"Waitlist signups in the last month"} />
      <RegisterCount startDate={startDateOneToThreeMonths} endDate={endDateOneToThreeMonths} description={"Waitlist signups 1-3 months ago"} />
      <RegisterCount startDate={startDateThreeToSixMonths} endDate={endDateThreeToSixMonths} description={"Waitlist signups 3-6 months ago"} />
      <RegisterCount startDate={startDateSixToTwelveMonths} endDate={endDateSixToTwelveMonths} description={"Waitlist signups 6+ months ago"} />
    </div>
  );
};

export default StatCards;
