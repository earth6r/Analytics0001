import * as React from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CircularQuestionMarkTooltip from "@/components/common/circular-question-mark-tooltip";

const MostPopularPropertiesInProgress = () => {
    return (
        <Card className="mt-6 shadow">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <div>
                        Most Popular Properties In Progress
                    </div>
                    <div>
                    <CircularQuestionMarkTooltip label="fake data atm" />
                    </div>
                </CardTitle>
                <CardDescription>Most popular properties in progress by customers</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row items-center justify-between">
                    <div className="uppercase font-extrabold text-3xl">les-2A</div>
                    <div className="uppercase font-extrabold text-3xl">les-3A</div>
                    <div className="uppercase font-extrabold text-3xl">les-4A</div>
                    <div className="uppercase font-extrabold text-3xl">les-5B</div>
                    <div className="uppercase font-extrabold text-3xl">les-6A</div>
                </div>
            </CardContent>
        </Card>
    )
};

export default MostPopularPropertiesInProgress;
