import { api } from "@/utils/api";
import { useRouter } from "next/router";

const SendEmail = () => {
    const getDesigns = api.sendgrid.getDesigns.useQuery();
    const router = useRouter();

    return (
        <div>
            <h1>Send Email</h1>

            {getDesigns.data && (
                <div className="grid grid-cols-3 gap-4">
                    {getDesigns.data.singleSends.result.map((template: any) => (
                        <div key={template.id} className="p-2 border hover:opacity-75" onClick={
                            async () => await router.push(`/send-email/${template.id}`)
                        }>
                            <h1>{template.id}</h1>
                            <h1>{template.name}</h1>
                            <h1>{template.status}</h1>
                            <h1>{JSON.stringify(template.categories)}</h1>
                            <h1>{template.send_at}</h1>
                            <h1>{template.created_at}</h1>
                            <h1>{template.updated_at}</h1>
                            <h1>{JSON.stringify(template.is_abtest)}</h1>
                            <h1>{JSON.stringify(template.abtest)}</h1>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SendEmail;
