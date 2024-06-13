import BuyingProgressChart from "./buying-progress-chart";
import BuyingProgressPieChart from "./buying-progress-pie-chart";
import MostPopularPropertiesInProgress from "./must-popular-properties-in-progress";

const CustomersTabContent = () => {
    return (
        <div>
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
