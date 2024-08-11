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
import { Infinity, Phone, School } from "lucide-react"

interface BookingTabsProps {
    onValueChange: (value: string) => void;
}

const BookingTabs = (props: BookingTabsProps) => {
    // TODO: Need to add value and onValueChange to the Tabs component, this will be sort of like a filter
    const { onValueChange } = props;

    return (
        <Tabs defaultValue="all" className="w-[500px]">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                    value="all"
                    onClick={() => onValueChange("all")}
                >
                    {/* TODO: make this a reusable component (like PhoneCallView or something) and import it in the dropdown in create booking as well*/}
                    <div className="flex flex-row items-center space-x-2">
                        <Infinity className="h-4 w-4" />
                        <h1>All</h1>
                    </div>
                </TabsTrigger>
                <TabsTrigger
                    value="Property Tour"
                    onClick={() => onValueChange("Property Tour")}
                >
                    {/* TODO: make this a reusable component (like PhoneCallView or something) and import it in the dropdown in create booking as well*/}
                    <div className="flex flex-row items-center space-x-2">
                        <School className="h-4 w-4" />
                        <h1>Property Tours</h1>
                    </div>
                </TabsTrigger>
                <TabsTrigger
                    value="Phone Call"
                    onClick={() => onValueChange("Phone Call")}
                >
                    {/* TODO: make this a reusable component (like PhoneCallView or something) and import it in the dropdown in create booking as well*/}
                    <div className="flex flex-row items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <h1>Phone Calls</h1>
                    </div>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

export default BookingTabs;
