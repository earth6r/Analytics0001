import { api } from "@/utils/api";
import { useRouter } from "next/router";

const SpecificId = () => {
    const router = useRouter();

    const getDesign = api.sendgrid.getDesign.useQuery(
        {
            id: router.query.id as string,
        },
        {
            enabled: !!router.query.id,
        }
    );

    return (
        <div>
            {
                getDesign.data && (
                    <div>
                        <h1>
                            ID: {getDesign.data.singleSend.id}
                        </h1>
                        <h1>
                            Name: {getDesign.data.singleSend.name}
                        </h1>
                        <h1>
                            Status: {getDesign.data.singleSend.status}
                        </h1>
                        <div>
                            Categories: {JSON.stringify(getDesign.data.singleSend.categories)}
                        </div>
                        <h1>
                            Send At: {getDesign.data.singleSend.send_at}
                        </h1>
                        <div>
                            Send To: {JSON.stringify(getDesign.data.singleSend.send_to)}
                        </div>
                        <h1>
                            Created At: {getDesign.data.singleSend.created_at}
                        </h1>
                        <h1>
                            Updated At: {getDesign.data.singleSend.updated_at}
                        </h1>
                        <h1>
                            Subject: {getDesign.data.singleSend.email_config.subject}
                        </h1>
                        <div
                            dangerouslySetInnerHTML={{ __html: getDesign.data.singleSend.email_config.html_content }}
                        ></div>
                        <div>
                            Plain Content: {getDesign.data.singleSend.email_config.plain_content}
                        </div>
                        <div>
                            Generate Plain Content: {JSON.stringify(getDesign.data.singleSend.email_config.generate_plain_content)}
                        </div>
                        <div>
                            Editor: {getDesign.data.singleSend.email_config.editor}
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default SpecificId;