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
import { Flame, Snowflake, ThermometerSun } from "lucide-react";

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
                <SelectItem value="hot" className="text-red-500">
                    <div className="flex flex-row items-center space-x-1">
                        <Flame className="w-4 h-4" />
                        <h1>Hot</h1>
                    </div>
                </SelectItem>
                <SelectItem value="warm" className="text-yellow-500">
                    <div className="flex flex-row items-center space-x-1">
                        <ThermometerSun className="w-4 h-4" />
                        <h1>Warm</h1>
                    </div>
                </SelectItem>
                <SelectItem value="cold" className="text-blue-500">
                    <div className="flex flex-row items-center space-x-1">
                        <Snowflake className="w-4 h-4" />
                        <h1>Cold</h1>
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}

export default HotWarmColdSelect;
