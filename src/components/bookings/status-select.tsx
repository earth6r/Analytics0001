import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Spinner from "../common/spinner"
import { useState } from "react"
import { Pencil, X } from "lucide-react"

interface StatusSelectProps {
    value: string
    onChange: (value: string) => void
    loading: boolean
}

const StatusSelect = (props: StatusSelectProps) => {
    const { value, onChange, loading } = props;

    const [editMode, setEditMode] = useState(false);

    return (
        <Select value={value} onValueChange={onChange} disabled={value === "completed"}>
            <div
                className="flex flex-row items-center space-x-2 cursor-pointer"
            >
                {!editMode && <div className="flex flex-row items-center space-x-1">
                    {value.split("-").map((word, index) => (
                        <h1 key={index} className="capitalize">{word}</h1>
                    ))}
                </div>}
                {editMode && <SelectTrigger className="w-[140px] focus:outline-none focus:ring-0 select-none">
                    {loading ? <div className="w-full flex items-center justify-center">
                        <Spinner />
                    </div> :
                        <SelectValue placeholder="Select a status" />}
                </SelectTrigger>}
                <div
                    onClick={() => setEditMode(!editMode)}
                >
                    {editMode ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                </div>
            </div>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
};

export default StatusSelect;
