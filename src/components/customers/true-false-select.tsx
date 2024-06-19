import * as React from "react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface BuyingPropertyTypeSelectProps {
    selectedItem: boolean | undefined;
    setSelectedItem: (selectedItem: boolean) => void;
}

export function TrueFalseSelect(props: BuyingPropertyTypeSelectProps) {
    const { selectedItem, setSelectedItem } = props;

    return (
        <Select value={selectedItem === true ? "true" : "false"} onValueChange={
            (value) => {
                setSelectedItem(value === "true" ? true : false);
            }
        }>
            <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select a property type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="true">
                    True
                </SelectItem>
                <SelectItem value="false">
                    False
                </SelectItem>
            </SelectContent>
        </Select>
    )
}
