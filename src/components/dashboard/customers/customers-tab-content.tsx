import StatCard from "@/components/common/stat-card";
import BuyingProgressChart from "./buying-progress-chart";
import BuyingProgressPieChart from "./buying-progress-pie-chart";
import MostPopularPropertiesInProgress from "./must-popular-properties-in-progress";
import CircularQuestionMarkTooltip from "@/components/common/circular-question-mark-tooltip";

const CustomersTabContent = () => {
    return (
        <div>
            {/* TODO: add proper icons to each stat card and its actual values instead of fake data */}
            <StatCard title="hi" description="Total Deposits" deltaValue={10} icon={<CircularQuestionMarkTooltip label="fake data atm" />} />
            <StatCard title="hi" description="Number of Customers" deltaValue={10} icon={<CircularQuestionMarkTooltip label="fake data atm" />} />
            <StatCard title="hi" description="Number of Customers in Buying Progress" deltaValue={10} icon={<CircularQuestionMarkTooltip label="fake data atm" />} />
            <StatCard title="hi" description="Number of Sold Properties" deltaValue={10} icon={<CircularQuestionMarkTooltip label="fake data atm" />} />
            <div className="flex flex-row items-start space-x-6 justify-center">
                <div className="w-full lg:w-2/3">
                    <BuyingProgressChart />
                    <MostPopularPropertiesInProgress />
                </div>
                <BuyingProgressPieChart />
            </div>
        </div>
    );
};

export default CustomersTabContent;
