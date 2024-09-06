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
                    <div className="grid gap-4 w-full px-6 pb-4">
                        <UpdateProfile
                            email={booking.email}
                            showProfileInputs={false}
                        />
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
                    {/* <Tabs defaultValue="meeting" className="w-full px-6 py-2" value={tab} onValueChange={setTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="meeting">Meeting Notes</TabsTrigger>
                            <TabsTrigger value="profile">Profile Data</TabsTrigger>
                        </TabsList>
                        <TabsContent value="meeting">
                        </TabsContent>
                        <TabsContent value="profile">
                            <div className="grid gap-4 w-full mb-4">
                                <UpdateProfile
                                    email={booking.email}
                                    setIsOpen={setOpen}
                                />
                            </div>
                        </TabsContent>
                    </Tabs> */}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MarkCompletedPostNotesDialog;
