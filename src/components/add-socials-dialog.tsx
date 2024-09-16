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
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "./ui/use-toast";
import { toastSuccessStyle } from "@/lib/toast-styles";
import Spinner from "./common/spinner";

interface AddSocialsDialog {
    potentialCustomer: any;
    refetchPotentialCustomers: () => Promise<any>;
}

const AddSocialsDialog = (props: AddSocialsDialog) => {
    const { potentialCustomer, refetchPotentialCustomers } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const [website, setWebsite] = useState<string>('');
    const [instagram, setInstagram] = useState<string>('');
    const [facebook, setFacebook] = useState<string>('');
    const [twitter, setTwitter] = useState<string>('');
    const [whatsApp, setWhatsApp] = useState<string>('');
    const [signal, setSignal] = useState<string>('');

    useEffect(() => {
        if (!potentialCustomer) {
            return;
        }

        setWebsite(potentialCustomer?.website);
        setInstagram(potentialCustomer?.instagram);
        setFacebook(potentialCustomer?.facebook);
        setTwitter(potentialCustomer?.twitter);
        setWhatsApp(potentialCustomer?.whatsApp);
        setSignal(potentialCustomer?.signal);

    }, [potentialCustomer]);

    const updateSocials = api.user.updateSocials.useMutation();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div className="text-blue-500 cursor-pointer hover:text-blue-400">+ Add Socials</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Socials</DialogTitle>
                    <DialogDescription>
                        {`Make changes to the socials. Click save when you're done.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="website" className="text-right">
                            Website
                        </Label>
                        <Input
                            id="website"
                            className="col-span-3"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="instagram" className="text-right">
                            Instagram
                        </Label>
                        <Input
                            id="instagram"
                            className="col-span-3"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="facebook" className="text-right">
                            Facebook
                        </Label>
                        <Input
                            id="facebook"
                            className="col-span-3"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="twitter" className="text-right">
                            Twitter
                        </Label>
                        <Input
                            id="twitter"
                            className="col-span-3"
                            value={twitter}
                            onChange={(e) => setTwitter(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="whatsApp" className="text-right">
                            WhatsApp
                        </Label>
                        <Input
                            id="whatsApp"
                            className="col-span-3"
                            value={whatsApp}
                            onChange={(e) => setWhatsApp(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="signal" className="text-right">
                            Signal
                        </Label>
                        <Input
                            id="signal"
                            className="col-span-3"
                            value={signal}
                            onChange={(e) => setSignal(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={
                            async () => {
                                setLoading(true);
                                await updateSocials.mutateAsync({
                                    email: potentialCustomer.email,
                                    website,
                                    instagram,
                                    facebook,
                                    twitter,
                                    whatsApp,
                                    signal,
                                });
                                await refetchPotentialCustomers();
                                toast({
                                    title: 'Socials updated',
                                    description: 'Socials updated successfully',
                                    className: toastSuccessStyle,
                                });
                                setLoading(false);
                                setOpen(false);
                            }
                        }
                    >
                        {loading ? <Spinner /> : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddSocialsDialog;
