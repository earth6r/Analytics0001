import StatCards from "@/components/stat-cards";
import PieChart from "@/components/interest-chart";
import RecentRegisters from "@/components/recent-registers";
import UserAgentMetricCards from "@/components/user-agent-metric-cards";

const Overview = () => {
    return (
        <div>
            <StatCards />
            <div className="p-6 flex flex-col md:flex-row items-center md:space-x-6">
                <PieChart />
                <RecentRegisters />
            </div>
            <UserAgentMetricCards />
        </div>
    );
};

export default Overview;
