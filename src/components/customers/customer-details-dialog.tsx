import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import CircularQuestionMarkTooltip from "../common/circular-question-mark-tooltip";
import { convertDateString } from "@/lib/utils";
import CopyTooltip from "./copy-tooltip";
import { useRouter } from "next/router";
import { useState } from "react";
import Spinner from "../common/spinner";

interface BuyingProgressDetailsDialog {
    customerDetails: any;
}

// TODO: make this a reusable component in a different file
export const DetailItem = (props: { label: string, value: string, tooltipLabel?: string, copyable?: boolean }) => {
    const { label, value, tooltipLabel = null, copyable = false } = props;

    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center space-x-2">
                <Label>{label}</Label>
                {tooltipLabel && <CircularQuestionMarkTooltip label={tooltipLabel} />}
            </div>
            {copyable ? <CopyTooltip value={value} />
                : <div className="truncate max-w-48">{value}</div>}
        </div>
    )

}

const CustomerDetailsDialog = (props: BuyingProgressDetailsDialog) => {
    const { customerDetails } = props;

    const router = useRouter();

    const [routeLoading, setRouteLoading] = useState(false);

    const handleClick = async () => {
        setRouteLoading(true);
        await router.push(`/user?email=${customerDetails.email}`);
        setRouteLoading(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">View Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Customer Details</DialogTitle>
                    <DialogDescription>
                        {`This is the buying progress details for the customer from the database.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="px-1">
                    <DetailItem label="Customer Name" value={
                        (customerDetails?.firstName || customerDetails?.lastName) ? (customerDetails?.firstName || "") + " " + (customerDetails?.lastName || "") : "No name set"
                    } />
                    <DetailItem label="Escrow Deposit" value={JSON.stringify(customerDetails?.buyingProgressData?.escrowDeposit) || "false"} />
                    <DetailItem label="Schedule Closing" value={JSON.stringify(customerDetails?.buyingProgressData?.scheduleClosing) || "false"} />
                    <DetailItem label="Download Documents" value={JSON.stringify(customerDetails?.buyingProgressData?.downloadDocuments) || "false"} />
                    <DetailItem label="Full Payment" value={JSON.stringify(customerDetails?.buyingProgressData?.fullPayment) || "false"} />
                    <DetailItem label="Completed" value={JSON.stringify(customerDetails?.buyingProgressData?.completed) || "false"} />
                    <DetailItem label="User Property Type" value={customerDetails?.userBuyingPropertyType || "No property type set"} tooltipLabel="Value of the user's set property type" />
                    <DetailItem label="Property Type" value={customerDetails?.buyingProgressData?.propertyType || "No property type set"} tooltipLabel="Value of the buying progress property type" />
                    <DetailItem label="Customer UID" value={customerDetails?.uid || "No customer UID set"} tooltipLabel="Database Id" copyable />
                    <DetailItem label="Created At" value={customerDetails?.createdAt?.seconds ? new Date(customerDetails.createdAt.seconds * 1000).toLocaleDateString()
                        : "No creation date set"} />
                    <DetailItem label="Has Password" value={JSON.stringify(customerDetails?.setPassword) || "false"} />
                    <DetailItem label="Last Completed Step" value={customerDetails?.buyingProgress || "Escrow Deposit"} />
                    <DetailItem label="Scheduled Calendar Date" value={convertDateString(customerDetails?.buyingProgressData?.scheduledCalendarDate) || "Not set"} tooltipLabel={customerDetails?.buyingProgressData?.scheduledCalendarDate} />
                    <DetailItem label="Number of Buying Progress" value={customerDetails?.buyingProgressCount} tooltipLabel="This is the count of users who are currently in or completed a purchase of a property. The user must complete a deposit before it is counted. A value of 0 may prevent updates from being made." />
                    <DetailItem label="Buying Progress IDs" value={customerDetails?.buyingProgressIds} tooltipLabel="Database IDs" copyable />

                    {customerDetails?.email && <div className="flex flex-row items-center justify-center mt-2">
                        {routeLoading ? <Spinner /> : <div onClick={handleClick} className="text-blue-400 hover:text-blue-500 cursor-pointer">View User Details</div>}
                    </div>}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="default" className="w-full">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CustomerDetailsDialog;
