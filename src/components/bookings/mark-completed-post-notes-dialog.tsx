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
import { useState } from "react";
import { api } from "@/utils/api";
import Spinner from "../common/spinner";
import { Check, NotepadText } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import CircularQuestionMarkTooltip from "../common/circular-question-mark-tooltip";
import { DatePicker } from "./date-picker";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { toastSuccessStyle } from "@/lib/toast-styles";

interface MarkCompletedPostNotesDialogProps {
    booking: any;
    getBooking: any;
};

const MarkCompletedPostNotesDialog = (props: MarkCompletedPostNotesDialogProps) => {
    const { booking, getBooking } = props;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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
    const [bookATourChecked, setBookATourChecked] = useState(false);

    const completeBooking = api.bookings.completeBooking.useMutation();

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
            <DialogContent className="sm:max-w-[425px] p-0 select-none">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Meeting Notes</DialogTitle>
                    <DialogDescription>
                        Meeting notes about the potential customer. Click the checkbox if the criteria is met.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-scroll">
                    <div className="grid gap-4 px-6 py-2">
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
                                    <Label htmlFor="budget">Budget</Label>
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
                            <div className="flex flex-row items-center justify-between mt-1">
                                <div className="text-muted-foreground text-sm">
                                    Min: {sliderValue[0]?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
                                </div>
                                <div className="text-muted-foreground text-sm">
                                    Max: {sliderValueMax[0]?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Slider
                                    value={sliderValue}
                                    onValueChange={(value) => setSliderValue(value)}
                                    min={500_000}
                                    max={2_000_000}
                                    step={50_000}
                                    className="mt-2"
                                />
                                <Slider
                                    value={sliderValueMax}
                                    onValueChange={(value) => setSliderValueMax(value)}
                                    min={500_000}
                                    max={2_000_000}
                                    step={50_000}
                                    className="mt-2"
                                />
                            </div>
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
                                    <Label htmlFor="timing">Timing</Label>
                                    <CircularQuestionMarkTooltip label="Check this field if the potential customer is in the same timing. Select the first day of the month if there is no specific day" />
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
                                <DatePicker
                                    // @ts-expect-error TODO: fix this
                                    value={selectedDate}
                                    onValueChange={(date) => setSelectedDate(date)}
                                />
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
                        </div>
                    </div>
                </div>
                <DialogFooter className="px-6 pb-6">
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
                                bookATour: bookATourChecked,
                            });
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
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? <Spinner /> :
                            <div className="flex items-center justify-center space-x-2">
                                <Check className="w-4 h-4" />
                                <h1>Mark As Completed</h1>
                            </div>
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MarkCompletedPostNotesDialog;
