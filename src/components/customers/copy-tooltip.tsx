import { CircleCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useEffect, useState } from "react";

interface CopyTooltip {
    children: React.ReactNode;
    copied: boolean;
    tooltipOpened: boolean;
    setTooltipOpened: (open: boolean) => void;
}

const CopyTooltip = (props: CopyTooltip) => {
    const { children, copied, tooltipOpened, setTooltipOpened } = props;

    useEffect(() => {
        if (copied) {
            setTooltipOpened(true);
            const timer = setTimeout(() => {
                setTooltipOpened(false);
            }, 2000); // Adjust the duration as needed

            return () => clearTimeout(timer);
        }
    }, [copied, setTooltipOpened]);

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip open={tooltipOpened}>
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
