import MessagesStatCards from "@/components/dashboard/messages/messages-stats-cards";
import NumberOfMessagesChart from "@/components/dashboard/messages/number-of-messages-chart";
import RecentMessages from "@/components/dashboard/messages/recent-messages";
import CumulativeMessages from "@/components/dashboard/messages/cumulative-messages";
import MessagesByWeek from "./messages-by-week";

const Messages = () => {
    return (
        <div>
            <MessagesStatCards />
            <div className="flex flex-col items-center p-6 lg:flex-row lg:space-x-6">
                <NumberOfMessagesChart />
                <RecentMessages />
            </div>
            <div className="flex flex-col items-center px-6 pb-6 lg:flex-row lg:space-x-6">
                <CumulativeMessages />
                <MessagesByWeek />
            </div>
        </div>
    );
};

export default Messages;
