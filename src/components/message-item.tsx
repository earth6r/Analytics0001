import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface MessageItemProps {
    message: {
        username: string;
        message: string;
        createdAt: string; // 2024-05-24T13:39:24.195Z
        initialMessage: boolean;
        agent: string;
        visitor: string;
        timestamp: number; // TODO: why is there a timestamp when we already have createdAt?
    };
}

const convertDateToWords = (date: string) => {
    const dateObject = new Date(date);
    const currentDate = new Date();
    const diff = currentDate.getTime() - dateObject.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
        return seconds === 1 ? `${seconds} second ago` : `${seconds} seconds ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
        return days === 1 ? `${days} day ago` : `${days} days ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
        return months === 1 ? `${months} month ago` : `${months} months ago`;
    }

    const years = Math.floor(months / 12);

    return years === 1 ? `${years} year ago` : `${years} years ago`;
}

const MessageItem = (props: MessageItemProps) => {
    const { message } = props;

    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-4">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${message.username}`} alt={message.username} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="">
                    <div className="truncate max-w-24">{message.username}</div>
                    <div className="text-muted-foreground text-sm">{
                        convertDateToWords(message.createdAt)
                    }</div>
                </div>
            </div>
            <div>
                <div className="truncate max-w-36"
                >{message.message}</div>
            </div>
        </div>
    );
};

export default MessageItem;
