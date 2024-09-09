import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface HotWarmColdSelectProps {
    value: string | undefined;
    onChange: (value: string) => void;
}

const HotWarmColdSelect = (props: HotWarmColdSelectProps) => {
    const { value, onChange } = props;

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="hot/warm/cold" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default HotWarmColdSelect;
