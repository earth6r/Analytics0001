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

const AddRegisterDialog = () => {
    const [Else, setElse] = useState("");
    const [adSet, setAdSet] = useState("");
    const [bedroomPreference, setBedroomPreference] = useState<string[]>([]);
    const [buyingTimelinedec2023, setBuyingTimelinedec2023] = useState<string>("");

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
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddRegisterDialog;
