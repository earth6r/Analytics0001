import StatCard from "@/components/stat-card";
import { BookUserIcon } from "lucide-react";

const StatCards = () => {
    return (
        <div className="grid grid-cols-1 gap-6 pl-6 pr-6 pt-2 md:grid-cols-2 lg:grid-cols-4">
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
