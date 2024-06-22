import StatCard from "@/components/common/stat-card";
import BuyingProgressChart from "./buying-progress-chart";
import BuyingProgressPieChart from "./buying-progress-pie-chart";
import MostPopularPropertiesInProgress from "./must-popular-properties-in-progress";
import CircularQuestionMarkTooltip from "@/components/common/circular-question-mark-tooltip";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";
import { DollarSign, Hash, Loader, HomeIcon } from "lucide-react";
import Spinner from "@/components/common/spinner";

const CustomersTabContent = () => {
    const { interval } = useInterval();

    const getTotalDeposits = api.customer.getTotalDeposits.useQuery(
        undefined,
        {
            refetchInterval: interval,
        }
    );

    const getNumberOfCustomers = api.customer.getNumberOfCustomers.useQuery(
        undefined,
        {
            refetchInterval: interval,
        }
    );

    const getNumberOfPropertiesInProgress = api.customer.getNumberOfPropertiesInProgress.useQuery(
        undefined,
        {
            refetchInterval: interval,
        }
    );

    const getNumberOfSoldProperties = api.customer.getNumberOfSoldProperties.useQuery(
        undefined,
        {
            refetchInterval: interval,
        }
    );

    return (
        <div>
            {/* TODO: add proper icons to each stat card and its actual values instead of fake data */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title={getTotalDeposits.data?.toString() && `$${getTotalDeposits.data?.toString()}`} description="Total Deposits" deltaValue={10} icon={<DollarSign />} />
                <StatCard title={getNumberOfCustomers.data?.toString()} description="Number of Customers" deltaValue={10} icon={<Hash />} />
                <StatCard title={getNumberOfPropertiesInProgress.data?.toString()} description="Number of Properties in Buying Progress" deltaValue={10} icon={<Loader />} />
                <StatCard title={getNumberOfSoldProperties.data?.toString()} description="Number of Sold Properties" deltaValue={10} icon={<HomeIcon />} />
            </div>
            <div className="flex flex-row items-start space-x-6 justify-center mt-6">
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
