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
import { Statuses } from "@/utils/status"
import { Badge } from "../ui/badge"

interface StatusSelectProps {
    value: string
    onChange: (value: string) => Promise<void>;
    loading: boolean
    booking: any
}

const StatusSelect = (props: StatusSelectProps) => {
    const { value, onChange, loading, booking } = props;

    const [editMode, setEditMode] = useState(false);

    const onChangePostHandler = async (value: string) => {
        await onChange(value);
        setEditMode(false);
    }

    return (
        <Select value={value} onValueChange={onChangePostHandler} disabled={value === "completed" || loading}>
            <div
                className="flex flex-row items-center space-x-2"
            >
                {!editMode &&
                    <Badge variant="secondary" className="flex flex-row items-center space-x-1 select-none">
                        {value.split("-").map((word, index) => (
                            // TODO: make the badge color dynamic based on its status i.e. completed is green, cancelled and no-show is red, etc.
                            <h1 key={index} className="capitalize">{word}</h1>
                        ))}
                    </Badge>}
                {editMode && <SelectTrigger className="w-[140px] focus:outline-none focus:ring-0 select-none">
                    {loading ? <div className="w-full flex items-center justify-center">
                        <Spinner />
                    </div> :
                        <SelectValue placeholder="Select a status" />}
                </SelectTrigger>}
                {booking?.status !== "completed" && <div
                    onClick={() => setEditMode(!editMode)}
                    className="cursor-pointer"
                >
                    {editMode ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                </div>}
            </div>
            <SelectContent>
                <SelectGroup>
                    {Statuses.filter((status) => status !== "completed").map((status, index) => (
                        <SelectItem key={index} value={status}>{status.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
};

export default StatusSelect;
