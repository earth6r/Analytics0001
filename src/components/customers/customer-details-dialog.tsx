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
import { useState } from "react"
import CircularQuestionMarkTooltip from "../common/circular-question-mark-tooltip";

interface BuyingProgressDetailsDialog {
    customerDetails: any;
}

const DetailItem = (props: { label: string, value: string, tooltipLabel?: string }) => {
    const { label, value, tooltipLabel = null } = props;

    return (
        <div className="flex flex-row justify-between">
            <div className="flex flex-row items-center space-x-2">
                <Label>{label}</Label>
                {tooltipLabel && <CircularQuestionMarkTooltip label={tooltipLabel} />}
            </div>
            <div>{value}</div>
        </div>
    )

}

const CustomerDetailsDialog = (props: BuyingProgressDetailsDialog) => {
    const { customerDetails } = props;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Details</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Buying Progress Details</DialogTitle>
                    <DialogDescription>
                        {`This is the buying progress details for the customer from the database.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="px-1">
                    <DetailItem label="Escrow Deposit" value={JSON.stringify(customerDetails?.buyingProgressData?.escrowDeposit) || "false"} />
                    <DetailItem label="Schedule Closing" value={JSON.stringify(customerDetails?.buyingProgressData?.scheduleClosing) || "false"} />
                    <DetailItem label="Download Documents" value={JSON.stringify(customerDetails?.buyingProgressData?.downloadDocuments) || "false"} />
                    <DetailItem label="Full Payment" value={JSON.stringify(customerDetails?.buyingProgressData?.fullPayment) || "false"} />
                    <DetailItem label="Completed" value={JSON.stringify(customerDetails?.buyingProgressData?.completed) || "false"} />
                    <DetailItem label="Property Type" value={customerDetails?.propertyType || "No property type set"} />
                    <DetailItem label="Customer UID" value={customerDetails?.buyingProgressData?.userUID || "No customer UID set"} tooltipLabel="Database Id"/>
                    <DetailItem label="Created At" value={customerDetails?.createdAt?.seconds ? new Date(customerDetails.createdAt.seconds * 1000).toLocaleDateString()
                        : "No creation date set"} />
                    <DetailItem label="Has Password" value={JSON.stringify(customerDetails?.setPassword) || "false"} />
                    <DetailItem label="Last Completed Step" value={customerDetails?.buyingProgress || "Escrow Deposit"} />
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
