import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";
import { Calendar, Mail, Phone, Timer } from "lucide-react";
import { useRouter } from "next/router";

const BookingDetails = () => {
    const router = useRouter();

    const { email, type, uid } = router.query;

    const bookingDetails = api.bookings.getBookingDetails.useQuery(
        {
            email: email as string,
            type: type as string,
            uid: uid as string,
        },
        {
            enabled: !!email && !!type && !!uid,
        }
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">{bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Contact Details</CardTitle>
                        <CardDescription>
                            Contact details for {bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex flex-row items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <div>{bookingDetails.data?.email}</div>
                            </div>
                            <div className="flex flex-row items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <div>{bookingDetails.data?.phoneNumber}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Appointment Details</CardTitle>
                        <CardDescription>
                            Contact details for {bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex flex-row items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <div>{formatTimestamp(bookingDetails.data?.startTimestamp)}</div>
                            </div>
                            <div className="flex flex-row items-center space-x-2">
                                <Timer className="w-4 h-4" />
                                <div className="font-semibold">Duration</div>
                                <div>{(bookingDetails.data?.endTimestamp - bookingDetails.data?.startTimestamp) / (60 * 1000) + " minutes"}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Customer Questions</CardTitle>
                    <CardDescription>
                        Notes and Questions created by the customer.
                    </CardDescription>
                </CardHeader>
                <CardContent className="max-w-max overflow-x-scroll">
                    <pre>
                        {bookingDetails.data?.notes}
                    </pre>
                </CardContent>
            </Card>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Call Notes</CardTitle>
                    <CardDescription>
                        Information about the call set by Home0001.
                    </CardDescription>
                </CardHeader>
                <CardContent className="max-w-max overflow-x-scroll">
                    <pre>
                        {bookingDetails.data?.additionalNotes}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookingDetails;
