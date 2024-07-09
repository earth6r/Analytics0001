import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PreviewProfilePictureDialogProps {
    pictureUrl: string;
}

const PreviewProfilePictureDialog = (props: PreviewProfilePictureDialogProps) => {
    const { pictureUrl } = props;

    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span className="text-blue-400 hover:text-blue-500 cursor-pointer select-none">
                    here
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] select-none">
                <DialogHeader>
                    <DialogTitle>Profile Picture Preview</DialogTitle>
                    <DialogDescription>
                        This is how your profile picture will look like.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={pictureUrl}
                        alt="Profile picture"
                        width={200}
                        height={200}
                        className={cn("border rounded-lg p-4", imageLoaded ? "block" : "hidden")}
                        onLoad={() => setImageLoaded(true)}
                    />
                    {!imageLoaded && <Skeleton className="w-[200px] h-[200px]" />}
                </div>
                <DialogFooter>
                    <DialogClose className="w-full">
                        <Button variant="default" className="w-full">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewProfilePictureDialog;
