import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CircleAlert, CircleOff, Hourglass } from "lucide-react";

export const nextStepsMapping = {
    "action:reschedule-phone-call-no-show": "Reschedule CALL No Show",
    "action:reschedule-property-tour-no-show": "Reschedule TOUR No Show",
    "action:reschedule-tour-cancelled": "Reschedule TOUR Cancelled",
    "action:connect-with-marty-pre-property-tour": "Connect with Marty Pre-Tour",
    "action:reschedule-phone-call-cancelled": "Reschedule CALL Cancelled",
    "action:schedule-property-tour": "Schedule TOUR",
    "action:connect-with-marty": "Connect with Marty",
    "awaiting:schedule-property-tour": "Schedule TOUR",
    "awaiting:connect-with-marty": "Connect with Marty",
    "awaiting:cancelled-phone-call": "Cancelled CALL",
    "awaiting:cancelled-property-tour": "Cancelled TOUR",
    "awaiting:no-show-phone-call": "No Show CALL",
    "awaiting:no-show-property-tour": "No Show TOUR",
    "awaiting:lead-lost": "Lead Lost",
    "awaiting:lead-won": "Lead Won",
    "other": "Other",
};

interface NextStepsProps {
    value: string;
    onChange: (value: string) => void;
    separate: string | null;
    disabled?: boolean;
}

const NextStepsDropdown = (props: NextStepsProps) => {
    const { value, onChange, separate = null, disabled = false } = props;

    return (
        <div>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder={separate ? `Select an ${separate} step` : "Select a next step"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {Object
                            .entries(nextStepsMapping)
                            .filter(([mappingKey]) => !separate || mappingKey.startsWith(separate) || mappingKey.startsWith("other"))
                            .map(([mappingKey, mappingValue]) => (
                                <SelectItem key={mappingKey} value={mappingKey} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <div className="flex flex-row items-center space-x-2">
                                        <div>
                                            {mappingKey.startsWith("action:") || separate === "action" ? <CircleAlert className="w-4 h-4" /> : mappingKey.startsWith("awaiting:") || separate === "awaiting" ? <Hourglass className="w-4 h-4" /> : <CircleOff className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            {mappingValue}
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default NextStepsDropdown
