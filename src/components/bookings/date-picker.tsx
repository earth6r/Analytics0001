"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar, CalendarNoDay } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatetimePickerProps {
    placeholder?: string;
    value: Date;
    onValueChange: (value: Date) => void;
}

export function DatePicker(props: DatetimePickerProps) {
    const { placeholder = "Pick a date", value, onValueChange } = props;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-auto p-0 z-[100] pointer-events-auto")}>
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(date) => {
                        onValueChange(date as Date);
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
