import { useState } from "react";
import { Input } from "../ui/input";
import { ArrowUpDownIcon, Plus, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";

interface NextStepsProps {
  setNextStepsVisible: (value: boolean) => void;
}

interface TestData {
  profile: string;
  nextSteps: string;
  notes: string;
  deferredDate: string;
  latestStatus: string;
}

const NextSteps = (props: NextStepsProps) => {
  const { setNextStepsVisible } = props;

  const [searchQuery, setSearchQuery] = useState('');

  const Statuses = [
    'Action Required',
    'Awaiting Response',
  ];
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  const [sortKey, setSortKey] = useState<string>('startTimestamp');
  const [sortOrder, setSortOrder] = useState<string>('asc');

  const allNextSteps = api.user.allNextSteps.useQuery();

  // Test data
  const testData: TestData[] = [
    {
      profile: 'John Doe',
      nextSteps: 'Follow up on email',
      notes: 'Sent initial contact email',
      deferredDate: '2024-09-01',
      latestStatus: 'Action Required',
    },
    {
      profile: 'Jane Smith',
      nextSteps: 'Schedule a meeting',
      notes: 'Discussed project scope',
      deferredDate: '2024-09-05',
      latestStatus: 'Awaiting Response',
    },
    {
      profile: 'Alice Johnson',
      nextSteps: 'Send contract',
      notes: 'Client interested in premium plan',
      deferredDate: '2024-09-10',
      latestStatus: 'Action Required',
    },
  ];

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
                    className="cursor-pointer select-none"
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
                        className="cursor-pointer select-none"
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
      <div className="text-4xl font-bold">IN PROGRESS - FAKE DATA</div>
      <div className="mt-4 hidden overflow-y-scroll xl:block">
        <div className="grid grid-cols-11 gap-4 font-semibold">
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
                if (sortKey === "startTimestamp") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortKey("startTimestamp");
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
        </div>

        {/* Test Data Rows */}
        <div>
          {testData.map((data, index) => (
            <div key={index} className="grid grid-cols-11 gap-4 items-center space-y-2">
              <div className="col-span-2">
                {data.profile}
              </div>
              <div className="col-span-2">
                {data.nextSteps}
              </div>
              <div className="col-span-3">
                {data.notes}
              </div>
              <div className="col-span-2">
                {data.deferredDate}
              </div>
              <div className="col-span-2">
                <Badge className={cn(
                  data.latestStatus === "Action Required" ? "bg-red-500 hover:bg-red-500" : "bg-foreground hover:bg-foreground",
                )}>
                  {data.latestStatus}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

          {JSON.stringify(allNextSteps.data)}
    </div>
  );
};

export default NextSteps;
