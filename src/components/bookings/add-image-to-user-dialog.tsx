import Spinner from "@/components/common/spinner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/utils/api"
import { useEffect, useState } from "react"
import { toast } from "../ui/use-toast"
import { toastErrorStyle, toastSuccessStyle } from "@/lib/toast-styles"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import Image from "next/image";
import { Textarea } from "../ui/textarea"
import { cn } from "@/lib/utils"
import { Skeleton } from "../ui/skeleton"

interface AddImageToUserDialogProps {
    refetch: () => Promise<any>;
    email: string;
    potentialCustomerData: any;
}

const MAX_FILE_SIZE = 1024 * 1024 * 4.5; // 4.5MB

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const validateUrl = (url: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
};

const AddImageToUserDialog = (props: AddImageToUserDialogProps) => {
    const { refetch, email, potentialCustomerData } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const savePotentialCustomerDetails = api.user.savePotentialCustomerDetails.useMutation();
    const uploadFileAndGetUrl = api.user.uploadFileAndGetUrl.useMutation();

    useEffect(() => {
        if (potentialCustomerData) {
            setImageUrl(potentialCustomerData?.imageUrl || '');
            setProfileNotes(potentialCustomerData?.profileNotes || '');
        }
    }, [potentialCustomerData]);

    async function onSubmit() {
        try {
            setIsLoading(true);

            await savePotentialCustomerDetails.mutateAsync({
                email,
                imageUrl,
                profileNotes,
            });
            await refetch();

            setIsLoading(false);

            toast({
                title: "Saved Details",
                description: "The details have been saved successfully.",
                className: toastSuccessStyle,
            });
            setOpen(false);
        } catch (error) {
            setIsLoading(false);
            toast({
                title: "An error occurred",
                description: "An error occurred while creating a booking in the database.",
                className: toastErrorStyle,
            });
        }
    }

    const [imageUrl, setImageUrl] = useState('');
    const [profileNotes, setProfileNotes] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const emptyForm = imageUrl === "" && profileNotes === "";
        const imageUrlEqual = imageUrl === potentialCustomerData?.imageUrl;
        const profileNotesEqual = profileNotes === potentialCustomerData?.profileNotes;
        const formValuesEqual = imageUrlEqual && profileNotesEqual;
        const isValidUrl = imageUrl && validateUrl(imageUrl);
        const _disabled = emptyForm || formValuesEqual || !isValidUrl;
        setIsDisabled(_disabled);
    }, [imageUrl, profileNotes, potentialCustomerData]);

    const handleUrlUpload = async (selectedFile: File | undefined) => {
        if (selectedFile) {
            if (selectedFile?.size > MAX_FILE_SIZE) {
                toast({
                    title: "File is too large",
                    description: "Please select a file that is less than 4.5MB.",
                    className: toastErrorStyle,
                });
                return;
            }

            if (!selectedFile.type.startsWith('image/')) {
                toast({
                    title: "Invalid file type",
                    description: "Please select an image file.",
                    className: toastErrorStyle,
                });
                return;
            }

            const base64String = await toBase64(selectedFile);
            const response = await uploadFileAndGetUrl.mutateAsync({
                fileBase64: base64String,
            });
            if (response?.url) {
                setImageUrl(response.url);
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e?.target?.files?.[0];

        await handleUrlUpload(selectedFile);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
        await handleUrlUpload(selectedFile);
    };

    const handleDragOver = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(e.target.value);
    };

    const handleProfileNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProfileNotes(e.target.value);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <span>+</span>
                    <span className="hidden md:block">Add Details</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle>Add Details to Potential Customer</DialogTitle>
                    <DialogDescription>
                        Add details to the potential customer.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-scroll p-2">
                    {imageUrl ? <div className="relative flex items-center justify-center h-48">
                        <Image
                            src={validateUrl(imageUrl) ? imageUrl : ""}
                            alt="Preview"
                            className={cn("rounded-lg border transition-opacity duration-300", imageLoaded ? "opacity-100" : "opacity-0")}
                            layout="fill"
                            objectFit="cover"
                            onLoad={() => setImageLoaded(true)}
                        />
                        {!imageLoaded && <Skeleton className="absolute h-48 rounded-lg" />}
                    </div> :
                        <div
                            className="rounded-lg border border-black border-dashed h-48 flex items-center justify-center cursor-pointer"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            // @ts-expect-error TODO: fix this
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center justify-center">
                                <div className="font-bold text-4xl">
                                    + Add Image
                                </div>
                                <div className="text-muted-foreground">Drop a file here to upload, or click here to browse</div>
                            </div>
                        </div>}
                    <div className="mt-4">
                        <Label>Image URL</Label>
                        <Input
                            className="mt-2"
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                            placeholder="URL"
                        />
                        {!validateUrl(imageUrl) && imageUrl !== "" && <div className="text-red-500 text-sm mt-1">Invalid URL</div>}
                    </div>
                    <div className="mt-4">
                        <Label>Profile Notes</Label>
                        <Textarea
                            className="mt-2 resize-none h-48"
                            value={profileNotes}
                            onChange={handleProfileNotesChange}
                            placeholder="Profile Notes"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" className="w-full" onClick={() => {
                        setImageUrl("");
                        setProfileNotes("");
                    }} disabled={isDisabled}>Clear</Button>
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger className="w-full">
                                <Button type="submit" className="w-full" onClick={onSubmit}
                                    disabled={isDisabled}>
                                    {isLoading ? <Spinner /> : "Save"}
                                </Button>
                            </TooltipTrigger>
                            {isDisabled && <TooltipContent>
                                <div className="space-y-1">
                                    <div>
                                        {imageUrl === "" && `The image URL is required. Please upload an image or provide a URL.`}
                                    </div>
                                </div>
                            </TooltipContent>}
                        </Tooltip>
                    </TooltipProvider>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddImageToUserDialog;
