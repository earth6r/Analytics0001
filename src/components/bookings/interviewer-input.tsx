import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Pencil, Save } from "lucide-react";
import Spinner from "../common/spinner";
import { api } from "@/utils/api";
import InterviewerDropdown from "./interviewer-dropdown";

interface InterviewerInputProps {
    booking: any
    refetch: () => Promise<any>
}

const InterviewerInput = (props: InterviewerInputProps) => {
    const { booking, refetch } = props;

    const [value, setValue] = useState(booking?.interviewer || "");
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue(booking?.interviewer || "");
    }, [booking?.interviewer]);

    const updateInterviewer = api.bookings.updateInterviewerName.useMutation();

    return (
        <div>
            {editMode ?
                <div>
                    {/* TODO: fix sizing so the size is the same if its loading or not so its not moving all over the place and distracting the user */}
                    {loading ? <Spinner /> :
                        <div className="flex flex-row items-center space-x-2">
                            <InterviewerDropdown value={value} onChange={setValue} />
                            <Save className="w-4 h-4" onClick={
                                async () => {
                                    setLoading(true);
                                    await updateInterviewer.mutateAsync({
                                        uid: booking?.uid,
                                        interviewer: value,
                                        bookingType: booking?.type,
                                    });
                                    await refetch();
                                    setEditMode(false);
                                    setLoading(false);
                                }
                            } />
                        </div>}
                </div>
                :
                <div className="flex flex-row items-center space-x-2">
                    <div>{value || "-"}</div>
                    <Pencil className="w-4 h-4" onClick={() => setEditMode(true)} />
                </div>
            }
        </div>
    );
};

export default InterviewerInput;
