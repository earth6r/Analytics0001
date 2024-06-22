import { CircleCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface CopyTooltip {
    children: React.ReactNode;
    copied: boolean;
}

const CopyTooltip = (props: CopyTooltip) => {
    const { children, copied } = props;

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip {...(copied ? { open: true } : {})}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-normal text-wrap max-w-96">{
                        copied ? <div className="flex flex-row items-center justify-center space-x-2">
                            <div>Copied</div>
                            <CircleCheck className="w-4 h-4" />
                        </div> :
                            "Click to copy"
                    }</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default CopyTooltip;
