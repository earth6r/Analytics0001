import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { ArrowUpDownIcon, CircleAlert, Hourglass, Plus, User, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn, formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";
import { useInterval } from "@/contexts/IntervalContext";
import NextStepsDialog from "./next-steps-dialog";
import { Skeleton } from "../ui/skeleton";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/router";

interface NextStepsProps {
  setNextStepsVisible: (value: boolean) => void;
}

const NextSteps = (props: NextStepsProps) => {
  const { setNextStepsVisible } = props;

  const { timezone } = useInterval();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  const Statuses = [
    'Action Required',
    'Awaiting Response',
  ];
  const [filterStatus, setFilterStatus] = useState<any[]>([
    'Action Required',
    'Awaiting Response',
    // null, // TODO: I need this because there's a chance there's no status. ask yan?
  ]);

  const [sortKey, setSortKey] = useState<string>('deferredDate');
  const [sortOrder, setSortOrder] = useState<string>('asc');

  const [sortedData, setSortedData] = useState<any[]>([]);

  const allNextSteps = api.user.allNextSteps.useQuery();

  useEffect(() => {
    if (allNextSteps.data) {
      let filteredData = allNextSteps.data.filter((data) => {
        return filterStatus.includes(data.latestStatus);
      });

      if (searchQuery) {
        const searchQueryLower = searchQuery.toLowerCase();
        filteredData = filteredData.filter((data) => {
          return data.profile.email.toLowerCase().includes(searchQueryLower) ||
            data.profile.firstName.toLowerCase().includes(searchQueryLower) ||
            data.profile.lastName.toLowerCase().includes(searchQueryLower);
        });
      }

      filteredData = filteredData.sort((a, b) => {
        if (sortOrder === "asc") {
          if (sortKey === "email") {
            return a.profile.email.localeCompare(b.profile.email);
          } else if (sortKey === "deferredDate") {
            return a?.deferredDate - b?.deferredDate;
          } else if (sortKey === "status") {
            return a.latestStatus.localeCompare(b.latestStatus);
          }
        } else {
          if (sortKey === "email") {
            return b.profile.email.localeCompare(a.profile.email);
          } else if (sortKey === "deferredDate") {
            return b?.deferredDate - a?.deferredDate;
          } else if (sortKey === "status") {
            return b.latestStatus.localeCompare(a.latestStatus);
          }
        }
      });

      setSortedData(filteredData);
    }
  }, [allNextSteps.data, sortKey, sortOrder, filterStatus, searchQuery]);

  // TODO:
  // - add profile picture
  // - add link to booking-details page

  return (
    <div>
      <div
        className="text-xs text-blue-500 hover:underline cursor-pointer select-none mt-1 mb-1"
        onClick={() => setNextStepsVisible(false)}
      >
        View Bookings?
      </div>
      <Input
        placeholder="Search..."
        className="w-full lg:w-1/4"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          // TODO: add search functionality
        }}
      />
      <div className="flex min-h-8 flex-row items-center mt-2">
        <div className="space-y-4">
          {filterStatus.length > 0 && (
            <div className="flex flex-row flex-wrap items-center">
              {filterStatus.map((status) => (
                <div key={status} className="p-1">
                  <Badge
                    className={cn("cursor-pointer select-none", status === "Action Required" ? "bg-red-500 hover:bg-red-600" : "bg-blue-300 hover:bg-blue-400")}
                    onClick={async () => {
                      setFilterStatus(
                        filterStatus.filter((s) => s !== status)
                      );
                    }}
                  >
                    <div className="flex flex-row items-center space-x-2">
                      <h1>{status}</h1>
                      <X className="h-4 w-4" />
                    </div>
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {Statuses.filter((status) => !filterStatus.includes(status))
            .length > 0 && (
              <div className="flex flex-row flex-wrap items-center">
                {Statuses.filter((status) => !filterStatus.includes(status)).map(
                  (status) => (
                    <div key={status} className="p-1">
                      <Badge
                        variant="default"
                        className={cn("cursor-pointer select-none", status === "Action Required" ? "bg-red-500 hover:bg-red-600" : "bg-blue-300 hover:bg-blue-400")}
                        onClick={async () => {
                          setFilterStatus([...filterStatus, status]);
                        }}
                      >
                        <div className="flex flex-row items-center space-x-2">
                          <h1>{status}</h1>
                          <Plus className="h-4 w-4" />
                        </div>
                      </Badge>
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      </div>
      <div className="mt-4 hidden overflow-y-scroll xl:block">
        <div className="grid grid-cols-12 gap-4 font-semibold">
          {/* Headers */}
          <div className="col-span-2 flex select-none flex-row items-center justify-start space-x-2">
            <h1>Profile</h1>
            <div
              className="rounded-lg p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                if (sortKey === "email") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortKey("email");
                }
              }}
            >
              <ArrowUpDownIcon className="h-4 w-4" />
            </div>
          </div>

          {/* Next Steps */}
          <div className="col-span-2 flex select-none flex-row items-center justify-start space-x-2">
            <h1>Next Steps</h1>
          </div>

          {/* Notes */}
          <div className="col-span-3 flex select-none flex-row items-center justify-start space-x-2">
            <h1>Notes</h1>
          </div>

          {/* Deferred Date */}
          <div className="col-span-2 flex select-none flex-row items-center justify-start space-x-2">
            <h1>Deferred Date</h1>
            <div
              className="rounded-lg p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                if (sortKey === "deferredDate") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortKey("deferredDate");
                }
              }}
            >
              <ArrowUpDownIcon className="h-4 w-4" />
            </div>
          </div>

          {/* Latest Status */}
          <div className="col-span-2 flex select-none flex-row items-center justify-start space-x-2">
            <h1>Latest Status</h1>
            <div
              className="rounded-lg p-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                if (sortKey === "status") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortKey("status");
                }
              }}
            >
              <ArrowUpDownIcon className="h-4 w-4" />
            </div>
          </div>

          {/* Actions */}
          <div className="col-span-1 flex select-none flex-row items-center justify-start space-x-2">
            <h1>Actions</h1>
          </div>
        </div>

        {/* Test Data Rows */}
        <div>
          {sortedData.map((data, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center space-y-2 border-b py-2">

              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <div
                      className="col-span-2 flex cursor-pointer flex-row items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={async () =>
                        await router.push(
                          `/booking-details?email=${data.profile.email}`,
                        )
                      }
                    >
                      <div>
                        <Avatar className="h-10 w-10 rounded-lg border">
                          <AvatarImage
                            src={data.profile?.imageUrl}
                            alt="@user"
                            className="object-cover"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div>
                          {data.profile.firstName || "No First Name Provided"}{" "}
                          {data.profile.lastName || "No Last Name Provided"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {data.profile.email || "No Email Provided"}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex flex-row items-center space-x-4 p-1">
                      <div>
                        {/* TODO: make this a component and reuse above's component and make className a prop b/c above is different class */}
                        <Avatar className="h-24 w-24 rounded-lg border">
                          <AvatarImage
                            src={data.profile?.imageUrl}
                            alt="@user"
                            className="object-cover"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <div className="text-lg">
                          {data.profile.firstName || "No First Name Provided"}{" "}
                          {data.profile.lastName || "No Last Name Provided"}
                        </div>
                        <div className="text-md text-muted-foreground">
                          {data.profile.email || "No Email Provided"}
                        </div>
                        <div
                          className="mt-2 cursor-pointer rounded-lg border border-muted-foreground p-1 text-muted-foreground hover:bg-gray-100 hover:text-foreground dark:hover:bg-gray-800"
                          onClick={async () =>
                            await router.push(
                              `/booking-details?email=${data.profile.email}`,
                            )
                          }
                        >
                          <div className="flex flex-row items-center justify-center space-x-2">
                            <User className="h-4 w-4" />
                            <h1>View Profile</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="col-span-2 flex flex-row items-center space-x-2">
                <div>
                  {data.latestStatus && (
                    <div>
                      {data.latestStatus === "Action Required" ? (
                        <CircleAlert className="h-4 w-4 text-red-500" />
                      ) : (
                        <Hourglass className="h-4 w-4 text-blue-300" />
                      )}
                    </div>
                  )}
                </div>
                <div>
                  {data.latestNextStep || "-"}
                </div>
              </div>
              <div className="col-span-3 whitespace-pre-wrap break-words">
                {data.notes || "-"}
              </div>
              <div className="col-span-2">
                {formatTimestamp(data?.deferredDate, false, timezone, true) || "-"}
              </div>
              <div className="col-span-2">
                <Badge className={cn(
                  data.latestStatus === "Action Required" ? "bg-red-500 hover:bg-red-500" : "bg-blue-300 hover:bg-blue-300",
                )}>
                  {data.latestStatus || "-"}
                </Badge>
              </div>

              <div className="col-span-1">
                <NextStepsDialog
                  email={data.profile.email}
                  variant="Modify"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 block xl:hidden">
        {allNextSteps.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-24" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {sortedData?.map((item: any, index) => (
              <NextStepsCard
                key={index}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface NextStepsCardProps {
  item: any;
}

const NextStepsCard = (props: NextStepsCardProps) => {
  const { item } = props;

  const { timezone } = useInterval();

  return (
    <Card
    >
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          <div>{item?.profile?.firstName} {item?.profile?.lastName}</div>
          <Badge
            className={cn(
              item?.latestStatus === "Action Required" ? "bg-red-500 hover:bg-red-500" : "bg-blue-300 hover:bg-blue-300",
            )}
          >
            {item?.latestStatus || "-"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Deferred Date: {formatTimestamp(item?.deferredDate, false, timezone) || "-"}
        </CardDescription>
        <div>
          <div className="flex flex-row items-center space-x-2">
            <div>
              {item?.latestStatus && (
                <div>
                  {item?.latestStatus === "Action Required" ? (
                    <CircleAlert className="h-4 w-4 text-red-500" />
                  ) : (
                    <Hourglass className="h-4 w-4 text-blue-300" />
                  )}
                </div>
              )}
            </div>
            <div>
              {item?.latestNextStep || "-"}
            </div>
          </div>

          <div className="mt-2">
            Notes: {item?.notes || "-"}
          </div>

          <div className="mt-2">
            Email: {item?.profile?.email}
          </div>

          <div className="mt-2">
            <NextStepsDialog
              email={item?.profile?.email}
              variant="Modify"
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default NextSteps;
