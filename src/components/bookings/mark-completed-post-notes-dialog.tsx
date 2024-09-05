import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import Spinner from "../common/spinner";
import { Check, CircleAlert, Hourglass, Maximize2, Minimize2, NotepadText } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import CircularQuestionMarkTooltip from "../common/circular-question-mark-tooltip";
import { DatePicker } from "./date-picker";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { toastSuccessStyle } from "@/lib/toast-styles";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";
import NextStepsDropdown, { nextStepsMapping } from "./next-steps-dropdown";
import { Separator } from "../ui/separator";
import moment from "moment";
import UpdateProfile from "../update-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface MarkCompletedPostNotesDialogProps {
    booking: any;
    getBooking: any;
};

const MarkCompletedPostNotesDialog = (props: MarkCompletedPostNotesDialogProps) => {
    const { booking, getBooking } = props;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState("meeting");

    const [productFitChecked, setProductFitChecked] = useState(false);
    const [projectFitNotes, setProjectFitNotes] = useState('');
    const [budgetChecked, setBudgetChecked] = useState(false);
    const [sliderValue, setSliderValue] = useState([500_000]);
    const [sliderValueMax, setSliderValueMax] = useState([2_000_000]);
    const [interestChecked, setInterestChecked] = useState(false);
    const [interestNotes, setInterestNotes] = useState('');
    const [communityChecked, setCommunityChecked] = useState(false);
    const [losAngelesChecked, setLosAngelesChecked] = useState(false);
    const [newYorkChecked, setNewYorkChecked] = useState(false);
    const [parisChecked, setParisChecked] = useState(false);
    const [londonChecked, setLondonChecked] = useState(false);
    const [berlinChecked, setBerlinChecked] = useState(false);
    const [mexicoCityChecked, setMexicoCityChecked] = useState(false);
    const [somewhereElseChecked, setSomewhereElseChecked] = useState(false);
    const [somewhereElseNotes, setSomewhereElseNotes] = useState('');
    const [timingChecked, setTimingChecked] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [timelineSelectedValue, setTimelineSelectedValue] = useState<string | null>(null);
    const [bookATourChecked, setBookATourChecked] = useState(false);

    const completeBooking = api.bookings.completeBooking.useMutation();
    const api_utils = api.useUtils();

    // next steps
    const [nextStepsNotes, setNextStepsNotes] = useState('');
    const [deferredDate, setDeferredDate] = useState<Date | null>(null);
    const [typeOfStep, setTypeOfStep] = useState<string | null>(null);
    const [nextStepsDropdownValue, setNextStepsDropdownValue] = useState<string>('');
    const [otherNextSteps, setOtherNextSteps] = useState<string>('');
    const [existingChainVisible, setExistingChainVisible] = useState(false);
    const [maximized, setMaximized] = useState(false);

    const existingNextSteps = api.bookings.getNextSteps.useQuery(
        {
            email: booking?.email
        },
        {
            enabled: !!booking?.email
        }
    );

    const addNextSteps = api.bookings.addNextSteps.useMutation();

    useEffect(() => {
        if (existingNextSteps.data) {
            setNextStepsNotes(existingNextSteps.data.nextStepsNotes);
            setDeferredDate(
                existingNextSteps.data.deferredDate ? moment.utc(moment.unix(existingNextSteps.data.deferredDate)).toDate() : null
            );
        }
    }, [existingNextSteps.data]);

    // TODO: break out into several components into a subfolder with a proper structure i.e. parent folder would be meeting-notes/...
    // https://github.com/users/apinanyogaratnam/projects/35/views/1?pane=issue&itemId=74675897
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="w-full space-x-2 select-none"
                    disabled={booking?.status === "completed"}
                >
                    <NotepadText className="w-4 h-4" />
                    <span>Meeting Notes</span>
                </Button>
            </DialogTrigger>
            <DialogContent className={cn("p-0 select-none", maximized ? "max-w-[95%] h-[95%]" : "sm:max-w-[425px]")}>
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="flex flex-row items-center space-x-2">
                        <div>
                            {tab === "meeting" ? "Meeting Notes" : "User Profile"}
                        </div>
                        <div className="hidden md:block">
                            {maximized ? <div
                                className="hover:bg-accent w-8 h-8 rounded-md p-1 flex items-center justify-center"
                                onClick={() => setMaximized(false)}
                            >
                                <Minimize2 className="w-4 h-4" />
                            </div> : <div
                                className="hover:bg-accent w-8 h-8 rounded-md p-1 flex items-center justify-center"
                                onClick={() => setMaximized(true)}
                            >
                                <Maximize2 className="w-4 h-4" />
                            </div>}
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        {tab === "meeting" ? "Meeting notes about the potential customer." : `Information about the potential customer. This will be saved to the user's profile.`}
                    </DialogDescription>
                </DialogHeader>
                {/* TODO: try making a grid-cols-2 with two things in same row i.e. product fit and budget in same row, need to account for minimize styling as well */}
                <div className={cn("overflow-y-scroll", maximized ? "h-full" : "max-h-96")}>
                    <Tabs defaultValue="meeting" className="w-full px-6 py-2" value={tab} onValueChange={setTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="meeting">Meeting Notes</TabsTrigger>
                            <TabsTrigger value="profile">Profile Data</TabsTrigger>
                        </TabsList>
                        <TabsContent value="meeting">
                            {/* MEETING NOTES */}
                            <div className="grid gap-4 w-full">
                                <div>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <Label htmlFor="product-fit">Product Fit</Label>
                                            <CircularQuestionMarkTooltip label="Check this field if the potential customer matches the product fit" />
                                        </div>
                                        <div className="flex flex-row items-center space-x-1">
                                            <h1 className="text-sm text-muted-foreground">Qualified?</h1>
                                            <Checkbox
                                                checked={productFitChecked}
                                                onCheckedChange={(checked) => setProductFitChecked(!!checked)}
                                            />
                                        </div>
                                    </div>
                                    <Textarea
                                        id="product-fit-notes"
                                        rows={4}
                                        value={projectFitNotes}
                                        onChange={(e) => setProjectFitNotes(e.target.value)}
                                        className="resize-none mt-2"
                                        placeholder="Notes about product fit"
                                    />
                                </div>

                                <div>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <Label htmlFor="budget">Max Budget</Label>
                                            <CircularQuestionMarkTooltip label="Check this field if the potential customer matches the budget. Slide the slider to select the min and max budget." />
                                        </div>
                                        <div className="flex flex-row items-center space-x-1">
                                            <h1 className="text-sm text-muted-foreground">Qualified?</h1>
                                            <Checkbox
                                                checked={budgetChecked}
                                                onCheckedChange={(checked) => setBudgetChecked(!!checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-center mt-1">
                                        <div className="text-muted-foreground text-sm">
                                            {sliderValueMax[0]?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
                                        </div>
                                    </div>
                                    <Slider
                                        value={sliderValueMax}
                                        onValueChange={(value) => {
                                            if (value[0] && sliderValue[0] && value[0] >= sliderValue[0]) {
                                                setSliderValueMax(value);
                                            }
                                        }}
                                        min={500_000}
                                        max={2_000_000}
                                        step={50_000}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-1">
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <Label htmlFor="interest">Interest</Label>
                                            <CircularQuestionMarkTooltip label="Check this field if the potential customer is interested" />
                                        </div>
                                        <div className="flex flex-row items-center space-x-1">
                                            <h1 className="text-sm text-muted-foreground">Qualified?</h1>
                                            <Checkbox
                                                checked={interestChecked}
                                                onCheckedChange={(checked) => setInterestChecked(!!checked)}
                                            />
                                        </div>
                                    </div>
                                    <Textarea
                                        id="post-notes"
                                        rows={4}
                                        value={interestNotes}
                                        onChange={(e) => setInterestNotes(e.target.value)}
                                        className="resize-none mt-2"
                                        placeholder="Notes about interest"
                                    />
                                </div>

                                <div>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex flex-row items-center space-x-1">
                                            <Label htmlFor="locations">Locations</Label>
                                            <CircularQuestionMarkTooltip label="Check this field if the potential customer is interested in any location" />
                                        </div>
                                        <div className="flex flex-row items-center space-x-1">
                                            <div className="text-xs text-muted-foreground">Select all</div>
                                            <Checkbox
                                                checked={losAngelesChecked && newYorkChecked && parisChecked && londonChecked && berlinChecked && mexicoCityChecked}
                                                onCheckedChange={(checked) => {
                                                    setLosAngelesChecked(!!checked);
                                                    setNewYorkChecked(!!checked);
                                                    setParisChecked(!!checked);
                                                    setLondonChecked(!!checked);
                                                    setBerlinChecked(!!checked);
                                                    setMexicoCityChecked(!!checked);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-[6px]">
                                        <div className="flex flex-row items-center justify-between space-x-1">
                                            <div className="text-xs text-muted-foreground">Los Angeles</div>
                                            <Checkbox
                                                checked={losAngelesChecked}
                                                onCheckedChange={(checked) => setLosAngelesChecked(!!checked)}
                                            />
                                        </div>

                                        <div className="flex flex-row items-center justify-between space-x-1">
                                            <div className="text-xs text-muted-foreground">New York</div>
                                            <Checkbox
                                                checked={newYorkChecked}
                                                onCheckedChange={(checked) => setNewYorkChecked(!!checked)}
                                            />
                                        </div>

                                        <div className="flex flex-row items-center justify-between space-x-1">
                                            <div className="text-xs text-muted-foreground">Paris</div>
                                            <Checkbox
                                                checked={parisChecked}
                                                onCheckedChange={(checked) => setParisChecked(!!checked)}
                                            />
                                        </div>

                                        <div className="flex flex-row items-center justify-between space-x-1">
                                            <div className="text-xs text-muted-foreground">London</div>
                                            <Checkbox
                                                checked={londonChecked}
                                                onCheckedChange={(checked) => setLondonChecked(!!checked)}
                                            />
                                        </div>

                                        <div className="flex flex-row items-center justify-between space-x-1">
                                            <div className="text-xs text-muted-foreground">Berlin</div>
                                            <Checkbox
                                                checked={berlinChecked}
                                                onCheckedChange={(checked) => setBerlinChecked(!!checked)}
                                            />
                                        </div>

                                        <div className="flex flex-row items-center justify-between space-x-1">
                                            <div className="text-xs text-muted-foreground">Mexico City</div>
                                            <Checkbox
                                                checked={mexicoCityChecked}
                                                onCheckedChange={(checked) => setMexicoCityChecked(!!checked)}
                                            />
                                        </div>

                                        <div className="flex flex-row items-center justify-between space-x-1">
                                            <div className="text-xs text-muted-foreground">Somewhere else</div>
                                            <Checkbox
                                                checked={somewhereElseChecked}
                                                onCheckedChange={(checked) => setSomewhereElseChecked(!!checked)}
                                            />
                                        </div>
                                        {somewhereElseChecked && (
                                            <Input
                                                id="somewhere-else-notes"
                                                value={somewhereElseNotes}
                                                onChange={(e) => setSomewhereElseNotes(e.target.value)}
                                                className="resize-none mt-2 h-10"
                                                placeholder="Specify the location"
                                            />
                                        )}
                                    </div>

                                </div>

                                <div>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <Label htmlFor="timeline">Timeline</Label>
                                            <CircularQuestionMarkTooltip label="Check this field if the potential customer is in the same buying timeline." />
                                        </div>
                                        <div className="flex flex-row items-center space-x-1">
                                            <h1 className="text-sm text-muted-foreground">Qualified?</h1>
                                            <Checkbox
                                                checked={timingChecked}
                                                onCheckedChange={(checked) => setTimingChecked(!!checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <Select
                                            value={timelineSelectedValue || undefined}
                                            onValueChange={(value) => setTimelineSelectedValue(value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a buying timeline" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Immediate" className="hover:bg-gray-100 dark:hover:bg-gray-800">Immediate</SelectItem>
                                                    <SelectItem value="1-3 Months" className="hover:bg-gray-100 dark:hover:bg-gray-800">1-3 Months</SelectItem>
                                                    <SelectItem value="3-6 Months" className="hover:bg-gray-100 dark:hover:bg-gray-800">3-6 Months</SelectItem>
                                                    <SelectItem value="6-12 Months" className="hover:bg-gray-100 dark:hover:bg-gray-800">6-12 Months</SelectItem>
                                                    <SelectItem value="Not Sure" className="hover:bg-gray-100 dark:hover:bg-gray-800">Not Sure</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <Label htmlFor="community-member-qualified">Community Member Qualified</Label>
                                            <CircularQuestionMarkTooltip label="Check this field if the potential customer is community member qualified" />
                                        </div>
                                        <div className="flex flex-row items-center space-x-1">
                                            <h1 className="text-sm text-muted-foreground">Qualified?</h1>
                                            <Checkbox
                                                checked={communityChecked}
                                                onCheckedChange={(checked) => setCommunityChecked(!!checked)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {booking.type === "Phone Call" &&
                                    <div>
                                        <div className="flex flex-row items-center justify-between">
                                            <div className="flex items-center space-x-1">
                                                <Label htmlFor="book-a-tour">Book a Tour?</Label>
                                                <CircularQuestionMarkTooltip label="Check this field if the potential customer needs a tour" />
                                            </div>
                                            <div className="flex flex-row items-center space-x-1">
                                                <h1 className="text-sm text-muted-foreground">Qualified?</h1>
                                                <Checkbox
                                                    checked={bookATourChecked}
                                                    onCheckedChange={(checked) => {
                                                        setBookATourChecked(!!checked);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>}

                                <div>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <Label htmlFor="date">Next Steps</Label>
                                            <CircularQuestionMarkTooltip label="Potential Customer's Next Steps" />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-sm text-muted-foreground mt-1">Notes</h1>
                                        <Textarea
                                            id="next-steps"
                                            rows={4}
                                            value={nextStepsNotes}
                                            onChange={(e) => setNextStepsNotes(e.target.value)}
                                            className="resize-none"
                                            placeholder="Notes about next steps"
                                        />
                                        <div className="mt-2">
                                            <h1 className="text-sm text-muted-foreground">Deferred Date</h1>
                                            <DatePicker
                                                placeholder="Select the deferred date"
                                                // @ts-expect-error TODO: Fix DatePicker type
                                                value={deferredDate}
                                                onValueChange={(value) => setDeferredDate(value as Date)}
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <h1 className="text-sm text-muted-foreground">Next Step</h1>
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
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 pb-4 mt-2">
                                <Button onClick={
                                    async () => {
                                        setLoading(true);
                                        await completeBooking.mutateAsync({
                                            uid: booking?.uid,
                                            bookingType: booking?.type,
                                            productFit: productFitChecked,
                                            productFitNotes: projectFitNotes,
                                            budget: budgetChecked,
                                            budgetAmount: sliderValue[0] as number,
                                            budgetAmountMax: sliderValueMax[0] as number,
                                            interest: interestChecked,
                                            interestNotes: interestNotes,
                                            communityMember: communityChecked,
                                            losAngeles: losAngelesChecked,
                                            newYork: newYorkChecked,
                                            paris: parisChecked,
                                            london: londonChecked,
                                            berlin: berlinChecked,
                                            mexicoCity: mexicoCityChecked,
                                            somewhereElse: somewhereElseChecked,
                                            somewhereElseNotes: somewhereElseNotes,
                                            timing: timingChecked,
                                            selectedDate: selectedDate,
                                            timeline: timelineSelectedValue ?? null,
                                            bookATour: bookATourChecked,
                                        });

                                        let deferredDateUtc = null;
                                        if (deferredDate) {
                                            deferredDateUtc = moment(deferredDate).utc().unix();
                                        }

                                        await addNextSteps.mutateAsync({
                                            email: booking?.email,
                                            nextStepsNotes,
                                            nextStepsDropdownValue: nextStepsDropdownValue === "other" ? `${typeOfStep}:${otherNextSteps}` : nextStepsDropdownValue,
                                            deferredDate: deferredDateUtc,
                                        });
                                        await api_utils.user.allNextSteps.refetch();
                                        await api_utils.user.getPotentialCustomerDetails.refetch();
                                        await existingNextSteps.refetch();
                                        await getBooking.refetch();
                                        setOpen(false);
                                        setLoading(false);

                                        setProductFitChecked(false);
                                        setProjectFitNotes('');
                                        setBudgetChecked(false);
                                        setSliderValue([500_000]);
                                        setSliderValueMax([2_000_000]);
                                        setInterestChecked(false);
                                        setInterestNotes('');
                                        setCommunityChecked(false);
                                        setLosAngelesChecked(false);
                                        setNewYorkChecked(false);
                                        setParisChecked(false);
                                        setLondonChecked(false);
                                        setBerlinChecked(false);
                                        setMexicoCityChecked(false);
                                        setSomewhereElseChecked(false);
                                        setSomewhereElseNotes('');
                                        setTimingChecked(false);
                                        setSelectedDate(undefined);
                                        setBookATourChecked(false);

                                        toast({
                                            title: "Success", // TODO: keep all the titles and descriptions the same format and similar text labels
                                            description: "Marked booking as completed",
                                            className: toastSuccessStyle,
                                        })
                                    }
                                }
                                    disabled={loading || (nextStepsDropdownValue === "other" && !otherNextSteps)}
                                    className="w-full"
                                >
                                    {loading ? <Spinner /> :
                                        <div className="flex items-center justify-center space-x-2">
                                            <Check className="w-4 h-4" />
                                            <h1>Mark As Completed</h1>
                                        </div>
                                    }
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="profile">
                            {/* PROFILE DATA */}
                            <div className="grid gap-4 w-full mb-4">
                                <UpdateProfile
                                    isTour={booking.type === "Property Tour"}
                                    email={booking.email}
                                    setIsOpen={setOpen}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MarkCompletedPostNotesDialog;
