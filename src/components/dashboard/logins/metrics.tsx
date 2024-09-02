import { useInterval } from "@/contexts/IntervalContext";
import { formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";

const Metrics = () => {
    const getMainLogins = api.user.getMainLogins.useQuery();
    const getAnalyticsLogins = api.user.getAnalyticsLogins.useQuery();

    const { timezone } = useInterval();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Home0001.com Logins</h1>
                <h1 className="text-xs text-muted-foreground mb-1">Buy process logins</h1>
                {getMainLogins.data
                    ?.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)
                    ?.map((login, index) => (
                        <div key={index} className="border-b grid grid-cols-3 gap-6">
                            <div>{login.email}</div>
                            <div>{formatTimestamp(login.timestamp.seconds, false, timezone, true)}</div>
                            <div>{login?.ipAddressMetadata?.city || "-"}, {login?.ipAddressMetadata?.country || "-"}</div>
                        </div>
                    ))}
            </div>

            <div>
                <h1 className="text-2xl font-bold">Analytics Logins</h1>
                {getAnalyticsLogins.data
                    ?.sort((a, b) => a.timestamp - b.timestamp)
                    ?.map((login, index) => (
                        <div key={index} className="border-b grid grid-cols-3 gap-6">
                            <div>{login.email}</div>
                            <div>{formatTimestamp(login.timestamp, true, timezone, true)}</div>
                            <div>{login?.ipAddressMetadata?.city || "-"}, {login?.ipAddressMetadata?.country || "-"}</div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Metrics;
