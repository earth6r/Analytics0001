import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "../ui/textarea"
import { DatePicker } from "./date-picker"
import { CircleAlert, Hourglass } from "lucide-react"
import NextStepsDropdown, { nextStepsMapping } from "./next-steps-dropdown"
import { Separator } from "../ui/separator"
import moment from "moment"
import { cn } from "@/lib/utils"

interface NextStepDialogTabsProps {
    nextStepsNotes: string;
    setNextStepsNotes: (value: string) => void;
    deferredDate: Date | null;
    setDeferredDate: (value: Date | null) => void;
    typeOfStep: string | null;
    setTypeOfStep: (value: string) => void;
    nextStepsDropdownValue: string;
    setNextStepsDropdownValue: (value: string) => void;
    otherNextSteps: string;
    setOtherNextSteps: (value: string) => void;
    existingNextSteps: any;
    existingChainVisible: boolean;
    setExistingChainVisible: (value: boolean) => void;
}

const NextStepDialogTabs = (props: NextStepDialogTabsProps) => {
    const {
        nextStepsNotes,
        setNextStepsNotes,
        deferredDate,
        setDeferredDate,
        typeOfStep,
        setTypeOfStep,
        nextStepsDropdownValue,
        setNextStepsDropdownValue,
        otherNextSteps,
        setOtherNextSteps,
        existingNextSteps,
        existingChainVisible,
        setExistingChainVisible,
    } = props;

    return (
        <div className="w-full">
            <div>
                <div className="mt-2">
                    <Label>Select a Next Step Type</Label>
                </div>
                <div>
                    <div className="flex flex-row items-center justify-between space-x-2 mt-1">
                        <div
                            onClick={
                                () => {
                                    setTypeOfStep('action')
                                    setNextStepsDropdownValue('')
                                }
                            }
                            className={cn(`flex flex-row items-center justify-center space-x-1`, `w-full text-center border rounded-md text-sm py-2 hover:bg-accent cursor-pointer`, typeOfStep === "action" && "bg-accent")}
                        >
                            <CircleAlert className="w-4 h-4 text-red-500" />
                            <div>Action</div>
                        </div>
                        <div
                            onClick={
                                () => {
                                    setTypeOfStep('awaiting')
                                    setNextStepsDropdownValue('')
                                }
                            }
                            className={cn(`flex flex-row items-center justify-center space-x-1`, `w-full text-center border rounded-md text-sm py-2 hover:bg-accent cursor-pointer`, typeOfStep === "awaiting" && "bg-accent")}
                        >
                            <Hourglass className="w-4 h-4 text-blue-300" />
                            <div>Awaiting</div>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <NextStepsDropdown
                        separate={typeOfStep}
                        value={nextStepsDropdownValue}
                        onChange={(value) => setNextStepsDropdownValue(value)}
                        disabled={typeOfStep === null}
                    />
                    {(existingNextSteps.data?.nextStepsDropdownValue || []).length > 0 && <p className="text-xs text-muted-foreground mt-1 select-none text-center">This value will append to existing steps.</p>}
                    {/* TODO: only display this if existing next steps exist (specifically if there's len > 0 of nextStepsDropdownValue from db) */}
                    {existingNextSteps.data && <div className="select-none">
                        {!existingChainVisible && (existingNextSteps.data?.nextStepsDropdownValue || []).length > 0 &&
                            <div className="flex flex-row items-center justify-center space-x-1">
                                <div onClick={
                                    () => setExistingChainVisible(true)
                                } className="text-xs text-blue-500 hover:underline cursor-pointer">View Chain</div>
                            </div>
                        }

                        {existingChainVisible &&
                            <div className="flex flex-col justify-center items-center">
                                <Separator className="w-48 my-1" />
                                <div className="text-xs text-muted-foreground space-y-1">
                                    {(existingNextSteps.data?.nextStepsDropdownValue || []).map((step: any, index: number) => (
                                        <div key={index} className="flex flex-row items-center space-x-1">
                                            {step.value.startsWith("action:") ? <CircleAlert className="w-4 h-4 text-red-500" /> : <Hourglass className="w-4 h-4 text-blue-300" />}
                                            {/* @ts-expect-error TODO: Fix this */}
                                            <h1>{nextStepsMapping[step.value] || step.value.split(":").slice(1).join(":")
                                            } -</h1>
                                            <h1>{
                                                moment.utc(moment.unix(step.timestamp)).format("MMM DD, YYYY")
                                            }</h1>
                                        </div>
                                    ))}
                                </div>
                            </div>}
                        {existingChainVisible && <div
                            onClick={() => setExistingChainVisible(false)}
                            className="text-xs text-blue-500 hover:underline cursor-pointer text-center"
                        >Hide Chain</div>}
                    </div>}
                </div>
                {
                    nextStepsDropdownValue === "other" &&
                    <div>
                        <Input
                            id="other-next-steps"
                            value={otherNextSteps}
                            onChange={(e) => {
                                let value = e.target.value
                                if (value.length > 0) {
                                    value = value.charAt(0).toUpperCase() + value.slice(1)
                                }
                                setOtherNextSteps(value)
                            }}
                            className="resize-none mt-2"
                            placeholder="You've selected other, describe the next steps"
                        />
                    </div>
                }
            </div>
            <div>
                <div>
                    <div className="mt-2">
                        <Label>Notes</Label>
                    </div>
                    <Textarea
                        id="next-steps"
                        value={nextStepsNotes}
                        onChange={(e) => setNextStepsNotes(e.target.value)}
                        className="resize-none"
                        placeholder="Notes about next steps"
                    />
                    <div className="mt-2">
                        <Label>Deferred Date</Label>
                        <DatePicker
                            placeholder="Select the deferred date"
                            // @ts-expect-error TODO: Fix DatePicker type
                            value={deferredDate}
                            onValueChange={(value) => setDeferredDate(value as Date)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NextStepDialogTabs;