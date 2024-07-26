import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
} from "@/components/ui/select"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface OptionProps {
    value: string
    selected: boolean
    addValue: (value: string) => void
    removeValue: (value: string) => void
    values: string[]
}

const Option = (props: OptionProps) => {
    const { value, selected, addValue, removeValue, values } = props;

    return (
        <div
            onClick={
                () => {
                    if (values.includes(value)) {
                        removeValue(value);
                    } else {
                        addValue(value);
                    }
                }
            }
            className="px-4 py-4 md:py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg select-none"
        >
            <div className="flex flex-row items-center space-x-2">
                <div className={cn(selected ? "block" : "invisible")}>
                    <Check className="w-4 h-4" />
                </div>
                <div>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </div>
            </div>
        </div>
    )
};

interface StatusSelectProps {
    values: string[]
    addValue: (value: string) => void
    removeValue: (value: string) => void
}

const FilterStatusMultiSelect = (props: StatusSelectProps) => {
    const { values, addValue, removeValue } = props;

    return (
        <Select>
            <SelectTrigger className="w-[240px] focus:outline-none focus:ring-0 select-none">
                <div>Filter Status</div>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <Option value="scheduled" selected={values.includes("scheduled")} addValue={addValue} removeValue={removeValue} values={values} />
                    <Option value="confirmed" selected={values.includes("confirmed")} addValue={addValue} removeValue={removeValue} values={values} />
                    <Option value="completed" selected={values.includes("completed")} addValue={addValue} removeValue={removeValue} values={values} />
                    <Option value="no-show" selected={values.includes("no-show")} addValue={addValue} removeValue={removeValue} values={values} />
                    <Option value="cancelled" selected={values.includes("cancelled")} addValue={addValue} removeValue={removeValue} values={values} />
                </SelectGroup>
            </SelectContent>
        </Select>
    )
};

export default FilterStatusMultiSelect;
