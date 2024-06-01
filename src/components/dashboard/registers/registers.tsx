import PieChart from "@/components/dashboard/registers/interest-chart";
import RecentRegisters from "@/components/dashboard/registers/recent-registers";
import StatCards from "@/components/dashboard/registers/stat-cards";
import UserAgentMetricCards from "@/components/dashboard/registers/user-agent-metric-cards";

const Registers = () => {
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

export default Registers;
