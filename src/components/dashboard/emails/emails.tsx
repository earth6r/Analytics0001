// import DeliveredEmailsChart from "@/components/dashboard/emails/delivered-emails-chart";
// import BlockedEmailsChart from "@/components/dashboard/emails/blocked-emails-chart";
// import BounceDropsEmailsChart from "@/components/dashboard/emails/bounce-drops-emails-chart";
// import EmailClicksChart from "@/components/dashboard/emails/email-clicks";
// import InvalidEmailsChart from "@/components/dashboard/emails/invalid-emails-chart";
// import OpenedEmailsChart from "@/components/dashboard/emails/opened-emails-chart";
// import ProcessedEmailsChart from "@/components/dashboard/emails/processed-emails-chart";
// import RequestsChart from "@/components/dashboard/emails/requests-chart";
// import SpamReportDropsChart from "@/components/dashboard/emails/spam-report-drops-chart";
// import UniqueClicksChart from "@/components/dashboard/emails/unique-clicks-chart";
// import UniqueOpensChart from "@/components/dashboard/emails/unique-opens-chart";
// import UnsubscribeDropsChart from "@/components/dashboard/emails/unsubscribe-drops-chart";
// import UnsubscribesChart from "@/components/dashboard/emails/unsubscribes-chart";
import BaseEmailsChart from "./base-emails-chart";

const Emails = () => {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {/* <DeliveredEmailsChart /> */}
            {/* <InvalidEmailsChart /> */}
            {/* <BlockedEmailsChart /> */}
            {/* <BounceDropsEmailsChart /> */}
            {/* <EmailClicksChart /> */}
            {/* <OpenedEmailsChart /> */}
            {/* <ProcessedEmailsChart /> */}
            {/* <RequestsChart /> */}
            {/* <SpamReportDropsChart /> */}
            {/* <UniqueClicksChart /> */}
            {/* <UniqueOpensChart /> */}
            {/* <UnsubscribeDropsChart /> */}
            {/* <UnsubscribesChart /> */}
            <BaseEmailsChart
                label="Delivered Emails"
                description="Delivered emails over time"
                valueKey="delivered"
            />
            <BaseEmailsChart
                label="Blocked Emails"
                description="Blocked emails over time"
                valueKey="blocks"
            />
            <BaseEmailsChart
                label="Bounce Drops Emails"
                description="Bounce drops emails over time"
                valueKey="bounce_drops"
            />
            <BaseEmailsChart
                label="Email Clicks"
                description="Email clicks over time"
                valueKey="clicks"
            />
            <BaseEmailsChart
                label="Invalid Emails"
                description="Invalid emails over time"
                valueKey="invalid_emails"
            />
            <BaseEmailsChart
                label="Opened Emails"
                description="Opened emails over time"
                valueKey="opens"
            />
            <BaseEmailsChart
                label="Processed Emails"
                description="Processed emails over time"
                valueKey="processed"
            />
            <BaseEmailsChart
                label="Requests"
                description="Requests over time"
                valueKey="requests"
            />
            <BaseEmailsChart
                label="Spam Report Drops"
                description="Spam report drops over time"
                valueKey="spam_report_drops"
            />
            <BaseEmailsChart
                label="Unique Clicks"
                description="Unique clicks over time"
                valueKey="unique_clicks"
            />
            <BaseEmailsChart
                label="Unique Opens"
                description="Unique opens over time"
                valueKey="unique_opens"
            />
            <BaseEmailsChart
                label="Unsubscribe Drops"
                description="Unsubscribe drops over time"
                valueKey="unsubscribe_drops"
            />
            <BaseEmailsChart
                label="Unsubscribes"
                description="Unsubscribes over time"
                valueKey="unsubscribes"
            />
        </div>
    );
};

export default Emails;
