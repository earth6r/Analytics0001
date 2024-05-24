import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    description: string;
    deltaMessage?: string;
    icon?: React.ReactNode;
}

const StatCard = (props: StatCardProps) => {
    const { title, description, deltaMessage, icon } = props;
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
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-xs text-muted-foreground">
                    {deltaMessage}
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;
