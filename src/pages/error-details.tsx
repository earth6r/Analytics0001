import Header from "@/components/common/header";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { ArrowLeftCircleIcon } from "lucide-react";
import { useRouter } from "next/router"
import { useEffect } from "react";

const ErrorDetails = () => {
    const router = useRouter();

    const { uid } = router.query;

    const getErrorDetails = api.error.getErrorDetails.useQuery(
        {
            uid: uid as string,
        },
        {
            enabled: !!uid,
        }
    );

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center space-x-2">
                    <ArrowLeftCircleIcon className="w-10 h-10 cursor-pointer" onClick={() => router.push("/errors")} />
                    <h1 className="text-4xl font-bold">Error Details</h1>
                </div>
                <div className="mt-6">
                    <p>UID: {uid}</p>
                    <div>
                        {getErrorDetails.data ? (
                            <div>
                                <div>Error Type: {getErrorDetails.data?.errorType}</div>
                                <div>Count: {getErrorDetails.data?.count}</div>
                                <div>Resolved: {getErrorDetails.data?.resolved ? "Yes" : "No"}</div>
                                <div>Status Code: {getErrorDetails.data?.statusCode}</div>
                                <pre className="w-96 h-96 overflow-y-scroll text-br" style={{ whiteSpace: 'pre-wrap' }}>
                                    Stack: {getErrorDetails.data?.error}
                                </pre>
                            </div>
                        ) : (
                            <Skeleton className="h-32" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorDetails;
