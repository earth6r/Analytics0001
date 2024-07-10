import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CopyTooltip from "../customers/copy-tooltip"
import { UserIcon } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

interface UserProfileCardProps {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
}

const UserProfileCard = (props: UserProfileCardProps) => {
    const { uid, email, firstName, lastName, createdAt } = props;

    return (
        <Card className="w-max">
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription className="flex flex-row items-center">
                    <UserIcon className="h-6 w-6 text-muted-foreground" />
                    <CopyTooltip value={uid} />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h1 className="text-muted-foreground font-light text-sm">First Name</h1>
                        <div>{firstName}</div>
                    </div>
                    <div>
                        <h1 className="text-muted-foreground font-light text-sm">Last Name</h1>
                        <div>{lastName}</div>
                    </div>
                    <div>
                        <h1 className="text-muted-foreground font-light text-sm">Email</h1>
                        <CopyTooltip value={email} />
                    </div>
                    <div>
                        <h1 className="text-muted-foreground font-light text-sm">Created At</h1>
                        <div>{formatTimestamp(createdAt, false)}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default UserProfileCard;
