import StatCard from "@/components/stat-card";
import { api } from "@/utils/api";
import { BookUserIcon } from "lucide-react";

const StatCards = () => {
    const messagesCount = api.post.getUnansweredMessagesCount.useQuery();

    return (
        <div className="grid grid-cols-1 gap-6 pl-6 pr-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title={messagesCount.data?.toString() ?? "0"}
                description="Unanswered Messages"
                deltaMessage="+5% from last month"
                icon={<BookUserIcon className="h-6 w-6 text-muted-foreground" />}
            />
            <StatCard
                title={"12"}
                description="Unanswered Messages"
                deltaMessage="+5% from last month"
                icon={<BookUserIcon className="h-6 w-6 text-muted-foreground" />}
            />
            <StatCard
                title={"12"}
                description="Unanswered Messages"
                deltaMessage="+5% from last month"
                icon={<BookUserIcon className="h-6 w-6 text-muted-foreground" />}
            />
            <StatCard
                title={"12"}
                description="Unanswered Messages"
                deltaMessage="+5% from last month"
                icon={<BookUserIcon className="h-6 w-6 text-muted-foreground" />}
            />
        </div>
    );
};

export default StatCards;
