import DeliveredEmailsChart from "@/components/dashboard/emails/delivered-emails-chart";
import BlockedEmailsChart from "@/components/dashboard/emails/blocked-emails-chart";
import BounceDropsEmailsChart from "@/components/dashboard/emails/bounce-drops-emails-chart";
import EmailClicksChart from "@/components/dashboard/emails/email-clicks";
import InvalidEmailsChart from "@/components/dashboard/emails/invalid-emails-chart";
import OpenedEmailsChart from "@/components/dashboard/emails/opened-emails-chart";
import ProcessedEmailsChart from "@/components/dashboard/emails/processed-emails-chart";
import RequestsChart from "@/components/dashboard/emails/requests-chart";
import SpamReportDropsChart from "@/components/dashboard/emails/spam-report-drops-chart";
import UniqueClicksChart from "@/components/dashboard/emails/unique-clicks-chart";
import UniqueOpensChart from "@/components/dashboard/emails/unique-opens-chart";
import UnsubscribeDropsChart from "@/components/dashboard/emails/unsubscribe-drops-chart";
import UnsubscribesChart from "@/components/dashboard/emails/unsubscribes-chart";

const Emails = () => {
    return (
        <div className="grid grid-cols-3 gap-6">
            <DeliveredEmailsChart />
            <BlockedEmailsChart />
            <BounceDropsEmailsChart />
            <EmailClicksChart />
            <InvalidEmailsChart />
            <OpenedEmailsChart />
            <ProcessedEmailsChart />
            <RequestsChart />
            <SpamReportDropsChart />
            <UniqueClicksChart />
            <UniqueOpensChart />
            <UnsubscribeDropsChart />
            <UnsubscribesChart />
        </div>
    );
};

export default Emails;
