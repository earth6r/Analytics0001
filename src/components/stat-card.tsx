import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
    title: string;
    description: string;
    deltaValue: number;
    icon?: React.ReactNode;
}

const StatCard = (props: StatCardProps) => {
    const { title, description, deltaValue, icon } = props;
    return (
        <Card className="shadow">
            <CardHeader className="pb-2">
                <div className="flex flex-row items-center justify-between">
                    <CardDescription>
                        {description}
                    </CardDescription>
                    <div>
                        {icon}
                    </div>
                </div>
                <CardTitle className="text-4xl">
                    {title ? title : <Skeleton className="w-28 h-10" />}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-muted-foreground">
                    {deltaValue ? `${deltaValue > 0 ? '+' : (deltaValue < 0 ? '-' : '')}${isFinite(deltaValue) ? deltaValue : "∞"}% from last month` : <Skeleton className="w-full h-5" />}
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;
