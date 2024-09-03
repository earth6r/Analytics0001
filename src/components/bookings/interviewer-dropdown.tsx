import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface InterviewerDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

const InterviewerDropdown = (props: InterviewerDropdownProps) => {
    const { value, onChange } = props;

    // TODO: when changed, update immediately in the database instead of saving in state (just like the status select)
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an interviewer" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="Christopher">Christopher</SelectItem>
                    <SelectItem value="Arthur">Arthur</SelectItem>
                    <SelectItem value="Marty">Marty</SelectItem>
                    <SelectItem value="Annika">Annika</SelectItem>
                    <SelectItem value="Carl">Carl</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default InterviewerDropdown;
