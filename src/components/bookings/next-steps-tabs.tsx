import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Flame, Infinity, Snowflake, ThermometerSun } from "lucide-react"

interface NextStepsTabsProps {
    value: string;
    onChange: (value: string) => void;
}

const NextStepsTabs = (props: NextStepsTabsProps) => {
    const { value, onChange } = props;

    return (
        <Tabs
            value={value}
            onValueChange={onChange}
            className="w-[400px]"
        >
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="space-x-2">
                    <Infinity className="w-4 h-4" />
                    <span>All</span>
                </TabsTrigger>
                <TabsTrigger value="hot" className="space-x-2">
                    <Flame className="w-4 h-4" />
                    <span>Hot</span>
                </TabsTrigger>
                <TabsTrigger value="warm" className="space-x-2">
                    <ThermometerSun className="w-4 h-4" />
                    <span>Warm</span>
                </TabsTrigger>
                <TabsTrigger value="cold" className="space-x-2">
                    <Snowflake className="w-4 h-4" />
                    <span>Cold</span>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

export default NextStepsTabs;
