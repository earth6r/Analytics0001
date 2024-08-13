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
                <TooltipTrigger asChild className="text-muted-foreground hover:text-primary">
                    <CircleHelp className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-normal text-wrap max-w-96">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default CircularQuestionMarkTooltip
