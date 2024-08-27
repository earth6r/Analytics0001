import ProgressChart from "@/components/common/progress-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/utils/api";

const WaitlistSignupsCount = () => {
    const waitlistCounts = api.register.getWaitlistCounts.useQuery();

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Waitlist Signups
                </CardTitle>
                <CardDescription>
                    Number of signups on the waitlist per timeline
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ProgressChart data={waitlistCounts} />
            </CardContent>
        </Card>
    );
};

export default WaitlistSignupsCount;
