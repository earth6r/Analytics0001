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
import Spinner from "../common/spinner"

interface StatusSelectProps {
    value: string
    onChange: (value: string) => void
    loading: boolean
}

const StatusSelect = (props: StatusSelectProps) => {
    const { value, onChange, loading } = props;

    return (
        <Select value={value} onValueChange={onChange} disabled={value === "completed"}>
            <SelectTrigger className="w-[140px] focus:outline-none focus:ring-0 select-none">
                {loading ? <div className="w-full flex items-center justify-center">
                    <Spinner />
                </div> :
                    <SelectValue placeholder="Select a status" />}
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="noshow">No Show</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
};

export default StatusSelect;
