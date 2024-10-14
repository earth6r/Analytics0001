import Header from "@/components/common/header";
import { api } from "@/utils/api";

const Emails = () => {
    const getMarketingEmailStats = api.sendgrid.getMarketingEmailStats.useQuery(undefined);

    return (
        <div>
            <Header />
            <div className="p-6">
                <h1 className="text-4xl font-bold">Emails</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-2">
                    {getMarketingEmailStats.data?.map((email) => (
                        <div key={email.singleSendId} className="bg-white p-4 rounded-lg shadow border flex flex-row items-start space-x-4">
                            <div className="relative w-1/2 h-[500px] overflow-hidden bg-blue-300">
                                <div className="absolute top-0 left-0 w-full h-full transform scale-100 origin-top-left" dangerouslySetInnerHTML={{ __html: email.templateData.htmlContent }}></div>
                            </div>
                            <div className="w-1/2 flex flex-col space-y-2">
                                <p>Audience List: -</p>
                                <p>Received: {email.received}</p>
                                <p>Opens: {email.opens}</p>
                                <p>Clicks: {email.clicks}</p>
                                <p>Total Calls Booked: -</p>
                            </div>
                            {/* TODO: need to display url clicks as well, need to do this on the BE */}
                            {/* <div>
                                {Array.from(email.urls).map((url) => (
                                    <p key={url}>{url}</p>
                                ))}
                            </div> */}
                        </div>
                    ))}
                </div>
                {/* {JSON.stringify(getMarketingEmailStats.data)} */}
            </div>
        </div>
    );
};

export default Emails;
