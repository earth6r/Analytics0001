import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const validUserBuyingPropertyTypes = [
    "les-2A",
    "les-2B",
    "les-2C",
    "les-2D",
    "les-3A",
    "les-3B",
    "les-3C",
    "les-3D",
    "les-4A",
    "les-4B",
    "les-4C",
    "les-4D",
    "les-5B",
    "les-6A",
    "les-6B",
    "townhouse-6",
    "townhouse-7",
];

interface BuyingPropertyTypeSelectProps {
    selectedItem: string | undefined;
    setSelectedItem: (selectedItem: string | undefined) => void;
}

export function BuyingPropertyTypeSelect(props: BuyingPropertyTypeSelectProps) {
    const { selectedItem, setSelectedItem } = props;

    return (
        <Select value={selectedItem} onValueChange={setSelectedItem}>
            <SelectTrigger className="w-[320px]">
                <SelectValue placeholder="Select a property type" />
            </SelectTrigger>
            <SelectContent>
                {validUserBuyingPropertyTypes.map((propertyType) => (
                    <SelectItem key={propertyType} value={propertyType}>
                        {propertyType}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
