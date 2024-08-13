import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInterval } from "@/contexts/IntervalContext";
import { api } from "@/utils/api";

const Errors = () => {
    const { interval } = useInterval();

    const getDistinctErrors = api.error.getDistinctErrors.useQuery(
        undefined,
        {
            refetchInterval: interval,
        }
    );

    // TODO: add mark as resolved button, this would loop through current errors and mark as resolved but new errors with the exact type should not be filled as resolved
    // https://github.com/users/apinanyogaratnam/projects/35/views/1?pane=issue&itemId=74689733

    return (
        <div>
            <Header />
            <div className="p-6">
                <h1 className="text-4xl font-bold">Errors</h1>
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="font-bold">Error Type</div>
                    <div className="font-bold">Count</div>
                    <div className="font-bold">View Error</div>
                </div>

                {getDistinctErrors.data ? getDistinctErrors.data?.map((error) => (
                    <div key={error.uid} className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                            {error.errorType}
                        </div>
                        <div>
                            {error.count}
                        </div>
                        <Button onClick={() => {
                            window.location.href = `/error-details?uid=${error.uid}`;
                        }}
                        className="max-w-max"
                        >
                            View Error
                        </Button>
                    </div>
                )) : (
                    <div className="mt-4 grid gap-4">
                        <Skeleton className="h-8 w-full" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Errors;
