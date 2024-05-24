import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const MessageItem = () => {
    return (
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-4">
                <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="">
                    <div>Lydia Martin</div>
                    <div className="text-muted-foreground text-sm">2 hours ago</div>
                </div>
            </div>
            <div>
                <div>Hey, how are you?</div>
            </div>
        </div>
    );
};

export default MessageItem;
