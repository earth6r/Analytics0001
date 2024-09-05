import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { interviewers } from "@/lib/constants";

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
                    {
                        Object.keys(interviewers).map((interviewer) => (
                            <SelectItem key={interviewer} value={interviewer}>
                                {interviewer}
                            </SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default InterviewerDropdown;
