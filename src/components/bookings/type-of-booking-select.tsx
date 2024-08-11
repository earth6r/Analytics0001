import * as React from "react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Phone, School } from "lucide-react";

interface BuyingPropertyTypeSelectProps {
    selectedItem: "Property Tour" | "Phone Call" | null | undefined;
    setSelectedItem: (selectedItem: string | undefined) => void;
    className?: string;
}

export function TypeOfBookingSelect(props: BuyingPropertyTypeSelectProps) {
    const { selectedItem, setSelectedItem, className = "w-[290px]" } = props;

    return (
        // @ts-expect-error NOTE: This needs a null value because clear form will not work otherwise in create customer dialog
        <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className={className}>
                <SelectValue placeholder="Select a booking type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Property Tour" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="flex flex-row items-center space-x-2">
                        <School className="h-4 w-4" />
                        <h1>Property Tour - 1h</h1>
                    </div>
                </SelectItem>
                <SelectItem value="Phone Call" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                    <div className="flex flex-row items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <h1>Phone Call - 15m</h1>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
