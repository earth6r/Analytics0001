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
import { CirclePlus } from "lucide-react"
import { useState } from "react"
import { DatePicker } from "./bookings/date-picker"
import { api } from "@/utils/api"
import { toast } from "./ui/use-toast"
import { toastSuccessStyle } from "@/lib/toast-styles"

const AddRegisterDialog = () => {
    const [Else, setElse] = useState("");
    const [adSet, setAdSet] = useState("");
    const [bedroomPreference, setBedroomPreference] = useState<string[]>([]);
    const [buyingTimelinedec2023, setBuyingTimelinedec2023] = useState<string>("");
    const [campaign, setCampaign] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<Date | null>(null);
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [fullQuery, setFullQuery] = useState<string>("");
    const [hutk, setHutk] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [locationsOfInterest, setLocationsOfInterest] = useState<string[]>([]);
    const [medium, setMedium] = useState<string>("");
    const [page, setPage] = useState<string>("");
    const [routes, setRoutes] = useState<string>("");
    const [source, setSource] = useState<string>("");
    const [userAgent, setUserAgent] = useState<string>("");

    const addRegister = api.register.addRegister.useMutation();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex flex-row items-center space-x-2">
                    <CirclePlus className="w-4 h-4" />
                    <h1>Add Register</h1>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Register</DialogTitle>
                    <DialogDescription>
                        {`Add a new register to save in the database.`}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-scroll">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="else" className="text-right">
                                Else
                            </Label>
                            <Input
                                id="else"
                                className="col-span-3"
                                value={Else}
                                onChange={(e) => setElse(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                adSet
                            </Label>
                            <Input
                                id="adSet"
                                className="col-span-3"
                                value={adSet}
                                onChange={(e) => setAdSet(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="bedroomPreference" className="text-right">
                                Bedroom Preference
                            </Label>
                            {bedroomPreference.map((item, index) => (
                                <div key={index}>
                                    <Input
                                        key={index}
                                        className="col-span-3"
                                        value={item}
                                        onChange={(e) => {
                                            const newItems = [...bedroomPreference];
                                            newItems[index] = e.target.value;
                                            setBedroomPreference(newItems);
                                        }}
                                    />
                                    <div
                                        className="text-xs text-red-500 text-center cursor-pointer hover:underline"
                                        onClick={() => {
                                            const newItems = [...bedroomPreference];
                                            newItems.splice(index, 1);
                                            setBedroomPreference(newItems);
                                        }}
                                    >X</div>
                                </div>
                            ))}
                        </div>
                        <div
                            className="text-xs text-blue-500 text-center cursor-pointer hover:underline"
                            onClick={() => setBedroomPreference([...bedroomPreference, ""])}
                        >
                            + Add Bedroom Preference
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="buyingTimelinedec2023" className="text-right">
                                Buying Timeline dec 2023
                            </Label>
                            <Input
                                id="buyingTimelinedec2023"
                                className="col-span-3"
                                value={buyingTimelinedec2023}
                                onChange={(e) => setBuyingTimelinedec2023(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="campaign" className="text-right">
                                Campaign
                            </Label>
                            <Input
                                id="campaign"
                                className="col-span-3"
                                value={campaign}
                                onChange={(e) => setCampaign(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="city" className="text-right">
                                City
                            </Label>
                            <Input
                                id="city"
                                className="col-span-3"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="content" className="text-right">
                                Content
                            </Label>
                            <Input
                                id="content"
                                className="col-span-3"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row items-center">
                            <Label htmlFor="createdAt" className="text-start">
                                Created At
                            </Label>
                            <div className="ml-12 w-full">
                                <DatePicker
                                    // @ts-expect-error TODO: fix this
                                    value={createdAt}
                                    onValueChange={(value) => setCreatedAt(value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                className="col-span-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="error" className="text-right">
                                Error
                            </Label>
                            <Input
                                id="error"
                                className="col-span-3"
                                value={error}
                                onChange={(e) => setError(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                className="col-span-3"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullQuery" className="text-right">
                                Full Query
                            </Label>
                            <Input
                                id="fullQuery"
                                className="col-span-3"
                                value={fullQuery}
                                onChange={(e) => setFullQuery(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hutk" className="text-right">
                                Hutk
                            </Label>
                            <Input
                                id="hutk"
                                className="col-span-3"
                                value={hutk}
                                onChange={(e) => setHutk(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                className="col-span-3"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="locationsOfInterest" className="text-right">
                                Locations Of Interest
                            </Label>
                            {locationsOfInterest.map((item, index) => (
                                <div key={index}>
                                    <Input
                                        key={index}
                                        className="col-span-3"
                                        value={item}
                                        onChange={(e) => {
                                            const newItems = [...locationsOfInterest];
                                            newItems[index] = e.target.value;
                                            setLocationsOfInterest(newItems);
                                        }}
                                    />
                                    <div
                                        className="text-xs text-red-500 text-center cursor-pointer hover:underline"
                                        onClick={() => {
                                            const newItems = [...locationsOfInterest];
                                            newItems.splice(index, 1);
                                            setLocationsOfInterest(newItems);
                                        }}
                                    >X</div>
                                </div>
                            ))}
                        </div>
                        <div
                            className="text-xs text-blue-500 text-center cursor-pointer hover:underline"
                            onClick={() => setLocationsOfInterest([...locationsOfInterest, ""])}
                        >
                            + Add Locations Of Interest
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="medium" className="text-right">
                                Medium
                            </Label>
                            <Input
                                id="medium"
                                className="col-span-3"
                                value={medium}
                                onChange={(e) => setMedium(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="page" className="text-right">
                                Page
                            </Label>
                            <Input
                                id="page"
                                className="col-span-3"
                                value={page}
                                onChange={(e) => setPage(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="routes" className="text-right">
                                Routes
                            </Label>
                            <Input
                                id="routes"
                                className="col-span-3"
                                value={routes}
                                onChange={(e) => setRoutes(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="source" className="text-right">
                                Source
                            </Label>
                            <Input
                                id="source"
                                className="col-span-3"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="userAgent" className="text-right">
                                User Agent
                            </Label>
                            <Input
                                id="userAgent"
                                className="col-span-3"
                                value={userAgent}
                                onChange={(e) => setUserAgent(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={
                        async () => {
                            // TODO: add field called manual: true and remove once this is working well
                            await addRegister.mutateAsync({
                                Else,
                                adSet,
                                bedroomPreference,
                                buyingTimelinedec2023,
                                campaign,
                                city,
                                content,
                                createdAt: createdAt ? createdAt.getTime() / 1000 : null,
                                email,
                                error,
                                firstName,
                                fullQuery,
                                hutk,
                                lastName,
                                locationsOfInterest,
                                medium,
                                page,
                                routes,
                                source,
                                userAgent,
                                manual: true,
                            });

                            setElse("");
                            setAdSet("");
                            setBedroomPreference([]);
                            setBuyingTimelinedec2023("");
                            setCampaign("");
                            setCity("");
                            setContent("");
                            setCreatedAt(null);
                            setEmail("");
                            setError("");
                            setFirstName("");
                            setFullQuery("");
                            setHutk("");
                            setLastName("");
                            setLocationsOfInterest([]);
                            setMedium("");
                            setPage("");
                            setRoutes("");
                            setSource("");
                            setUserAgent("");

                            toast({
                                title: "Register added",
                                description: "The register has been added successfully.",
                                className: toastSuccessStyle,
                            })
                        }
                    }>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddRegisterDialog;
