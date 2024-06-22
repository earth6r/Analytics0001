import { CircleCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface CopyTooltip {
    value: string;
}

const CopyTooltip = (props: CopyTooltip) => {
    const { value } = props;

    const [copied, setCopied] = useState<boolean>(false);
    const [tooltipOpened, setTooltipOpened] = useState<boolean>(false);

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip open={tooltipOpened}>
                <TooltipTrigger asChild>
                    <div className="truncate max-w-48 hover:text-blue-400 cursor-pointer" onClick={
                        () => {
                            navigator.clipboard.writeText(value);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 2000);
                        }
                    } onMouseEnter={() => setTooltipOpened(true)}
                        onMouseLeave={() => setTooltipOpened(false)}>{value}</div>
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
