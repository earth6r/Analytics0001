import * as React from "react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { propertyTypes } from "@/lib/property-types";

interface BuyingPropertyTypeSelectProps {
    selectedItem: string | undefined;
    setSelectedItem: (selectedItem: string | undefined) => void;
}

export function BuyingPropertyTypeSelect(props: BuyingPropertyTypeSelectProps) {
    const { selectedItem, setSelectedItem } = props;

    return (
        <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className="w-[290px]">
                <SelectValue placeholder="Select a property type" />
            </SelectTrigger>
            <SelectContent>
                {propertyTypes.map((propertyType) => (
                    <SelectItem key={propertyType} value={propertyType}>
                        {propertyType}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
