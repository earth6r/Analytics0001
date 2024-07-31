import * as React from "react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface BuyingPropertyTypeSelectProps {
    selectedItem: "propertyTour" | "phoneCall" | null | undefined;
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
                <SelectItem value="propertyTour" className="cursor-pointer">
                    Property Tour
                </SelectItem>
                <SelectItem value="phoneCall" className="cursor-pointer">
                    Phone Call
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
