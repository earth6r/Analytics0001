import { useState } from "react";
import { Input } from "../ui/input";
import { ArrowUpDownIcon, Plus, X } from "lucide-react";
import { Badge } from "../ui/badge";

interface NextStepsProps {
  setNextStepsVisible: (value: boolean) => void;
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

  return (
    <div>
      <div
        className="text-xs text-blue-500 hover:underline cursor-pointer select-none mt-1"
        onClick={
          () => setNextStepsVisible(false)
        }
      >View Bookings?</div>
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
          {
            filterStatus.length > 0 &&
            <div className="flex flex-row flex-wrap items-center">
              {filterStatus.map((status) => (
                <div key={status} className="p-1">
                  <Badge
                    className="cursor-pointer select-none"
                    onClick={async () => {
                      setFilterStatus(
                        filterStatus.filter((s) => s !== status),
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
            </div>}

          {Statuses
            .filter((status) => !filterStatus.includes(status))
            .length > 0 &&
            <div className="flex flex-row flex-wrap items-center">
              {Statuses
                .filter((status) => !filterStatus.includes(status))
                .map((status) => (
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
                ))}
            </div>}
        </div>
      </div>
      <div className="mt-4 hidden overflow-y-scroll xl:block">
        <div className="grid grid-cols-11 gap-4 font-semibold">
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

          {/* next steps */}
          <div className="col-span-3 flex select-none flex-row items-center justify-start space-x-2">
            <h1>Next Steps</h1>
          </div>

          {/* notes */}
          <div className="col-span-3 flex select-none flex-row items-center justify-start space-x-2">
            <h1>Notes</h1>
          </div>

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
        </div>

        {/* add test data */}
        <div className="">
              <div className="grid grid-cols-11 gap-4 items-center">
                <div>hi</div>
                <div>hi</div>
                <div>hi</div>
              </div>
        </div>

      </div>
    </div>
  );
};

export default NextSteps;
