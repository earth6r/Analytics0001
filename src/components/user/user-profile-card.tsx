import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CopyTooltip from "../customers/copy-tooltip"
import { formatTimestamp } from "@/lib/utils";

interface UserProfileCardProps {
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    propertyType: string;
}

const UserProfileCard = (props: UserProfileCardProps) => {
    const { email, firstName, lastName, createdAt, propertyType } = props;

    return (
        <Card className="w-max mt-4">
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h1 className="text-muted-foreground font-light text-sm">Full Name</h1>
                        <div>{firstName + " " + lastName}</div>
                    </div>
                    <div>
                        <h1 className="text-muted-foreground font-light text-sm">Property Type</h1>
                        <div>{propertyType}</div>
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
