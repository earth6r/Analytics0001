import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { CircleHelp } from "lucide-react"

interface CircularQuestionMarkTooltipProps {
    label: string
}

const CircularQuestionMarkTooltip = (props: CircularQuestionMarkTooltipProps) => {
    const { label } = props

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <CircleHelp className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-normal text-wrap w-96">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default CircularQuestionMarkTooltip
