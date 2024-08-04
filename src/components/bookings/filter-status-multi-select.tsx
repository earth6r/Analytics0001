import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectTrigger,
} from "@/components/ui/select"
import { Check, ListFilter } from "lucide-react"
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
                <div className="flex flex-row items-center space-x-1">
                    {value.split("-").map((word, index) => (
                        <h1 key={index} className="capitalize">{word}</h1>
                    ))}
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
            <SelectTrigger className="max-w-max focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 select-none hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="flex flex-row items-center space-x-2 px-2">
                    <ListFilter className="w-4 h-4" />
                    <h1>
                        Filter Status
                    </h1>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <Option value="scheduled" selected={values.includes("scheduled")} addValue={addValue} removeValue={removeValue} values={values} />
                    <Option value="confirmed" selected={values.includes("confirmed")} addValue={addValue} removeValue={removeValue} values={values} />
                    <Option value="completed" selected={values.includes("completed")} addValue={addValue} removeValue={removeValue} values={values} />
                    <Option value="no-show" selected={values.includes("no-show")} addValue={addValue} removeValue={removeValue} values={values} />
                    <Option value="cancelled" selected={values.includes("cancelled")} addValue={addValue} removeValue={removeValue} values={values} />
                    <Option value="rescheduled" selected={values.includes("rescheduled")} addValue={addValue} removeValue={removeValue} values={values} />
                </SelectGroup>
            </SelectContent>
        </Select>
    )
};

export default FilterStatusMultiSelect;
