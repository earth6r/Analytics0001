import Header from "@/components/common/header";
import { api } from "@/utils/api";

const Emails = () => {
    const getMarketingEmailStats = api.sendgrid.getMarketingEmailStats.useQuery(undefined);

    return (
        <div>
            <Header />
            <div className="p-6">
                <h1 className="text-4xl font-bold">Emails</h1>
            </div>
        </div>
    );
};

export default Emails;
