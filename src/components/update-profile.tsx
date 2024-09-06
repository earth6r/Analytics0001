import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "@/utils/api";
import Spinner from "./common/spinner";
import { toast } from "./ui/use-toast";
import { toastSuccessStyle } from "@/lib/toast-styles";
import { Skeleton } from "./ui/skeleton";

interface UpdateProfileProps {
    email: string;
    setIsOpen?: (isOpen: boolean) => void;
}

const UpdateProfile = (props: UpdateProfileProps) => {
    const { email, setIsOpen = null } = props;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState<number | null>(null);
    const [profession, setProfession] = useState(""); // Creative, Tech, Student, Rich Kid, MedLaw, Lit, Finance, Other
    const [otherProfession, setOtherProfession] = useState("");
    const [website, setWebsite] = useState("");
    const [instagram, setInstagram] = useState("");
    const [facebook, setFacebook] = useState("");
    const [twitter, setTwitter] = useState("");
    const [whatsApp, setWhatsApp] = useState("");
    const [telegram, setTelegram] = useState("");
    const [signal, setSignal] = useState("");
    const [relationshipStatus, setRelationshipStatus] = useState(""); // Single, Couple, Family (select)
    const [kids, setKids] = useState<number | null>(null);
    const [hasPets, setHasPets] = useState<boolean | null>(null);
    const [petTypes, setPetTypes] = useState<string[]>([]);
    const [petCount, setPetCount] = useState<number>(1);
    const [bio, setBio] = useState("");
    const [personalNotes, setPersonalNotes] = useState("");

    const [communityFit, setCommunityFit] = useState("");
    const [communityScore, setCommunityScore] = useState<number | null>(null);
    const [personalityType, setPersonalityType] = useState<string | null>(null);
    const [relevance, setRelevance] = useState<string[]>([]);
    const [eyeCatchingNote, setEyeCatchingNote] = useState("");
    const [knowOMA, setKnowOMA] = useState<boolean | null>(null);
    const [OMANotes, setOMANotes] = useState("");
    const [interestInHomeSwapping, setInterestInHomeSwapping] = useState<boolean | null>(null);
    const [interestInHomeSwappingNotes, setInterestInHomeSwappingNotes] = useState("");
    const [currentlyLivingIn, setCurrentlyLivingIn] = useState("");
    const [currentLivingSituation, setCurrentLivingSituation] = useState("");
    const [firstTimeBuyer, setFirstTimeBuyer] = useState<boolean | null>(null);
    const [cashBuyer, setCashBuyer] = useState<boolean | null>(null);
    const [broker, setBroker] = useState<boolean | null>(null);
    const [attorney, setAttorney] = useState<boolean | null>(null);
    const [whosPaying, setWhosPaying] = useState("");
    const [otherPayer, setOtherPayer] = useState("");
    const [homeType, setHomeType] = useState<string | null>(null);
    const [homePurchaseType, setHomePurchaseType] = useState<string | null>(null);
    const [mortgagePreQualified, setMortgagePreQualified] = useState<boolean | null>(null);
    const [wantsHelpFinancing, setWantsHelpFinancing] = useState<boolean | null>(null);
    const [lookingForCity, setLookingForCity] = useState("");
    const [lookingForNeighborhood, setLookingForNeighborhood] = useState("");
    const [lookingForUnitType, setLookingForUnitType] = useState(""); // Studio, Townhouse, 1 Bedroom, 2 Bedroom, 3 Bedroom, Other
    const [otherUnitType, setOtherUnitType] = useState("");
    const [sliderValue,] = useState([500_000]);
    const [sliderValueMax, setSliderValueMax] = useState([2_000_000]);
    const [buyingTimeline, setBuyingTimeline] = useState<string[]>([]); //  immediate, 1-3, 3-6, 6-12, 12 - 18 mos, 18 - 24 mos, 24 months+
    const [funnelType, setFunnelType] = useState(""); // Real Buyer, Window Shopper, Long Term Lead, Fan, Unqualified
    const [realBuyerTimeline, setRealBuyerTimeline] = useState(""); // Immediate, Midterm, Longterm
    const [relevantProperty, setRelevantProperty] = useState<string[]>([]); // LES, Bed Stuy, Echo Park
    const [travelForWork, setTravelForWork] = useState<boolean | null>(null);
    const [travelFrequency, setTravelFrequency] = useState("");
    const [familyAbroad, setFamilyAbroad] = useState<string>("");
    const [frequentedCities, setFrequentedCities] = useState<string>("");
    const [desiredCities, setDesiredCities] = useState<string>("");
    const [necessityOrAmenity, setNecessityOrAmenity] = useState<string>("");
    const [howTheyFoundHome0001, setHowTheyFoundHome0001] = useState<string>("");
    const [whatSparkInterest, setWhatSparkInterest] = useState<string>("");
    const [whatTheyLikeAboutApartments, setWhatTheyLikeAboutApartments] = useState<string>("");
    const [whatTheyDontLikeAboutApartments, setWhatTheyDontLikeAboutApartments] = useState<string>("");
    const [otherNeighborhoods, setOtherNeighborhoods] = useState<string>("");
    const [otherCities, setOtherCities] = useState<string>("");
    const [additionalNotes, setAdditionalNotes] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);

    const getProfileData = api.bookings.getProfileData.useQuery({
        email,
    });
    const updateProfileData = api.bookings.updateProfileData.useMutation();

    useEffect(() => {
        // TODO: query existing and set values (in the api, get values where needed i.e. firstName from bookings if not set or whatever)
        if (getProfileData.data) {
            const data = getProfileData.data;

            setFirstName(data?.firstName || "");
            setLastName(data?.lastName || "");
            setGender(data?.gender || "");
            setAge(data?.age || null);
            setProfession(data?.profession || "");
            setOtherProfession(""); // because when submitting, if its other, it will get saved in profession and not otherProfession
            setWebsite(data?.website || "");
            setInstagram(data?.instagram || "");
            setFacebook(data?.facebook || "");
            setTwitter(data?.twitter || "");
            setWhatsApp(data?.whatsApp || "");
            setTelegram(data?.telegram || "");
            setSignal(data?.signal || "");
            setRelationshipStatus(data?.relationshipStatus || "");
            setKids(data?.kids || null);
            setHasPets(data?.hasPets || null);
            setPetTypes(data?.petTypes || []);
            setPetCount(data?.petTypes?.length || 1);
            setBio(data?.bio || "");
            setPersonalNotes(data?.personalNotes || "");
            setCommunityFit(data?.communityFit || "");
            setCommunityScore(data?.communityScore || null);
            setPersonalityType(data?.personalityType || null);
            setRelevance(data?.relevance || []);
            setEyeCatchingNote(data?.eyeCatchingNote || "");
            setKnowOMA(data?.knowOMA || null);
            setOMANotes(data?.OMANotes || "");
            setInterestInHomeSwapping(data?.interestInHomeSwapping || null);
            setInterestInHomeSwappingNotes(data?.interestInHomeSwappingNotes || "");
            setCurrentlyLivingIn(data?.currentlyLivingIn || "");
            setCurrentLivingSituation(data?.currentLivingSituation || "");
            setFirstTimeBuyer(data?.firstTimeBuyer || null);
            setCashBuyer(data?.cashBuyer || null);
            setBroker(data?.broker || null);
            setAttorney(data?.attorney || null);
            setWhosPaying(data?.whosPaying || "");
            setOtherPayer("");
            setHomeType(data?.homeType || null);
            setHomePurchaseType(data?.homePurchaseType || null);
            setMortgagePreQualified(data?.mortgagePreQualified || null);
            setWantsHelpFinancing(data?.wantsHelpFinancing || null);
            setLookingForCity(data?.lookingForCity || "");
            setLookingForNeighborhood(data?.lookingForNeighborhood || "");
            setLookingForUnitType(data?.lookingForUnitType || "");
            setOtherUnitType(""); // because when submitting, if its other, it will get saved in lookingForUnitType and not otherUnitType
            setSliderValueMax([data?.maxBudget || 2_000_000]);
            setBuyingTimeline(data?.buyingTimeline || []);
            setFunnelType(data?.funnelType || "");
            setRealBuyerTimeline(data?.realBuyerTimeline || "");
            setRelevantProperty(data?.relevantProperty || []);
            setTravelForWork(data?.travelForWork || null);
            setTravelFrequency(data?.travelFrequency || "");
            setFamilyAbroad(data?.familyAbroad || "");
            setFrequentedCities(data?.frequentedCities || "");
            setDesiredCities(data?.desiredCities || "");
            setNecessityOrAmenity(data?.necessityOrAmenity || "");
            setHowTheyFoundHome0001(data?.howTheyFoundHome0001 || "");
            setWhatSparkInterest(data?.whatSparkInterest || "");
            setWhatTheyLikeAboutApartments(data?.whatTheyLikeAboutApartments || "");
            setWhatTheyDontLikeAboutApartments(data?.whatTheyDontLikeAboutApartments || "");
            setOtherNeighborhoods(data?.otherNeighborhoods || "");
            setOtherCities(data?.otherCities || "");
            setAdditionalNotes(data?.additionalNotes || "");
        }
    }, [getProfileData.data]);

    const onSubmit = async () => {
        setIsLoading(true);
        const _personalityType = personalityType === "Other" ? "Other" : personalityType;

        await updateProfileData.mutateAsync({
            email,
            firstName,
            lastName,
            gender,
            age,
            profession: profession === "Other" ? otherProfession : profession,
            website,
            instagram,
            facebook,
            twitter,
            whatsApp,
            telegram,
            signal,
            relationshipStatus,
            kids,
            hasPets,
            petTypes: hasPets ? petTypes : [],
            bio,
            personalNotes,
            communityFit,
            communityScore,
            personalityType: _personalityType,
            relevance,
            eyeCatchingNote,
            knowOMA,
            OMANotes,
            interestInHomeSwapping,
            interestInHomeSwappingNotes,
            currentlyLivingIn,
            currentLivingSituation,
            firstTimeBuyer,
            cashBuyer,
            broker,
            attorney,
            whosPaying: whosPaying === "Other" ? otherPayer : whosPaying,
            homeType,
            homePurchaseType,
            mortgagePreQualified,
            wantsHelpFinancing,
            lookingForCity,
            lookingForNeighborhood,
            lookingForUnitType: lookingForUnitType === "Other" ? otherUnitType : lookingForUnitType,
            maxBudget: sliderValueMax[0],
            buyingTimeline,
            funnelType,
            realBuyerTimeline: funnelType === "Real Buyer" ? realBuyerTimeline : null,
            relevantProperty,
            travelForWork,
            travelFrequency,
            familyAbroad,
            frequentedCities,
            desiredCities,
            necessityOrAmenity,
            howTheyFoundHome0001,
            whatSparkInterest,
            whatTheyLikeAboutApartments,
            whatTheyDontLikeAboutApartments,
            otherNeighborhoods,
            otherCities,
            additionalNotes,
        });

        await getProfileData.refetch();

        toast({
            title: "Success",
            description: "Profile updated successfully",
            className: toastSuccessStyle,
        });
        if (setIsOpen) setIsOpen(false);
        setIsLoading(false);
    };

    return (
        <div>
            {getProfileData.isLoading ? <Skeleton className="h-24" /> : <div className="grid gap-4">
                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="gender">Gender</Label>
                    </div>
                    <Input
                        id="gender"
                        value={gender}
                        placeholder="Gender"
                        onChange={(e) => {
                            setGender(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="age">Age</Label>
                    </div>
                    <Input
                        id="age"
                        type="number"
                        value={age ? age.toString() : ""}
                        placeholder="Age"
                        onChange={(e) => {
                            try {
                                const value = parseInt(e.target.value);
                                if (value < 0) {
                                    throw new Error("Invalid value");
                                }
                                setAge(value);
                            } catch (error) {
                                setAge(null);
                            }
                        }}
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label>Profession</Label>
                    <Select value={profession || undefined} onValueChange={setProfession}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a profession" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Creative", "Tech", "Student", "Rich Kid", "MedLaw", "Lit", "Finance", "Other"].map((professionItem) => (
                                <SelectItem key={professionItem} value={professionItem} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                    {professionItem}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {
                        profession === "Other" && (
                            <Input
                                id="otherProfession"
                                placeholder="Other Profession"
                                value={otherProfession}
                                onChange={(e) => {
                                    setOtherProfession(e.target.value);
                                }}
                                className="mt-2"
                            />
                        )
                    }
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="website">Website</Label>
                    </div>
                    <Input
                        id="website"
                        value={website}
                        placeholder="Website"
                        onChange={(e) => {
                            setWebsite(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="instagram">Instagram</Label>
                    </div>
                    <Input
                        id="instagram"
                        value={instagram}
                        placeholder="Instagram"
                        onChange={(e) => {
                            setInstagram(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="facebook">Facebook</Label>
                    </div>
                    <Input
                        id="facebook"
                        value={facebook}
                        placeholder="Facebook"
                        onChange={(e) => {
                            setFacebook(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="twitter">Twitter</Label>
                    </div>
                    <Input
                        id="twitter"
                        value={twitter}
                        placeholder="Twitter"
                        onChange={(e) => {
                            setTwitter(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="whatsApp">WhatsApp</Label>
                    </div>
                    <Input
                        id="whatsApp"
                        value={whatsApp}
                        placeholder="WhatsApp"
                        onChange={(e) => {
                            setWhatsApp(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="telegram">Telegram</Label>
                    </div>
                    <Input
                        id="telegram"
                        value={telegram}
                        placeholder="Telegram"
                        onChange={(e) => {
                            setTelegram(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="signal">Signal</Label>
                    </div>
                    <Input
                        id="signal"
                        value={signal}
                        placeholder="Signal"
                        onChange={(e) => {
                            setSignal(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label>Relationship Status</Label>
                    <Select value={relationshipStatus || undefined} onValueChange={setRelationshipStatus}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a relationship status" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Single", "Couple", "Family"].map((relationshipStatusItem) => (
                                <SelectItem key={relationshipStatusItem} value={relationshipStatusItem} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                    {relationshipStatusItem}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="kids">Kids</Label>
                    </div>
                    <Input
                        id="kids"
                        type="number"
                        value={kids || kids === 0 ? kids.toString() : ""}
                        placeholder="Kids"
                        onChange={(e) => {
                            try {
                                const value = parseInt(e.target.value);
                                if (value < 0) {
                                    throw new Error("Invalid value");
                                }
                                setKids(value);
                            } catch (error) {
                                setKids(null);
                            }
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label>Has Pets</Label>
                    <div className="flex items-center space-x-1">
                        <h1 className="text-sm">Yes</h1>
                        <Checkbox
                            id="hasPets"
                            checked={hasPets || false}
                            onCheckedChange={(checked) => setHasPets(!!checked)}
                        />
                    </div>
                    {
                        hasPets && (
                            <div>
                                <Label>Pet Types</Label>
                                <div>
                                    {
                                        // Input
                                        Array.from({ length: petCount }).map((_, index) => (
                                            <div key={index} className="flex items-center space-x-1">
                                                <Input
                                                    id={`petType${index}`}
                                                    value={petTypes[index] || ""}
                                                    placeholder="Pet Type"
                                                    onChange={(e) => {
                                                        const newPetTypes = [...petTypes];
                                                        newPetTypes[index] = e.target.value;
                                                        setPetTypes(newPetTypes);
                                                    }}
                                                    className="mt-1"
                                                />
                                                <div className="cursor-pointer" onClick={() => {
                                                    const newPetTypes = [...petTypes];
                                                    newPetTypes.splice(index, 1);
                                                    setPetTypes(newPetTypes);
                                                    setPetCount(petCount - 1);
                                                }}>
                                                    <X className="w-4 h-4" />
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div className="flex items-center justify-center space-x-1 cursor-pointer">
                                        <div
                                            onClick={() => setPetCount(petCount + 1)}
                                            className="text-blue-600 hover:underline text-xs mt-1"
                                        >
                                            + Add Pet Type
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                        id="bio"
                        value={bio}
                        placeholder="Bio"
                        onChange={(e) => {
                            setBio(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="personalNotes">Personal Notes</Label>
                    <Input
                        id="personalNotes"
                        value={personalNotes}
                        placeholder="Personal Notes"
                        onChange={(e) => {
                            setPersonalNotes(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="communityFit">Community Fit</Label>
                    </div>
                    <Input
                        id="communityFit"
                        value={communityFit}
                        placeholder="Community Fit"
                        onChange={(e) => {
                            setCommunityFit(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div className="">
                    <div className="flex items-center space-x-1">
                        <Label htmlFor="communityScore">Community Score</Label>
                    </div>
                    <Input
                        id="communityScore"
                        type="number"
                        value={communityScore ? communityScore.toString() : ""}
                        placeholder="Community Score worst (1) - best (5)"
                        onChange={(e) => {
                            try {
                                const value = parseInt(e.target.value);
                                if (value < 1 || value > 5) {
                                    throw new Error("Invalid value");
                                }
                                setCommunityScore(value);
                            } catch (error) {
                                setCommunityScore(null);
                            }
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="personalityType">Personality Type</Label>
                    <Select value={personalityType || undefined} onValueChange={setPersonalityType}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a personality type" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Creative", "Tech", "Student", "Rich Kid", "MedLaw", "Lit", "Finance", "Other"].map((personality) => (
                                <SelectItem key={personality} value={personality} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                    {personality}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {
                        personalityType === "Other" && (
                            <Input
                                id="otherPersonality"
                                placeholder="Other Personality Type"
                                className="mt-2"
                            />
                        )
                    }
                </div>

                <div>
                    <Label>Relevance</Label>
                    {
                        ["Design", "Home swapping", "Location", "Furnished", "Architecture", "Buying a home", "Investment", "Community"].map((relevanceItem) => (
                            <div key={relevanceItem} className="flex items-center space-x-1">
                                <h1 className="text-sm">{relevanceItem}</h1>
                                <Checkbox
                                    id={relevanceItem}
                                    checked={relevance.includes(relevanceItem)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setRelevance([...relevance, relevanceItem]);
                                        } else {
                                            setRelevance(relevance.filter((item) => item !== relevanceItem));
                                        }
                                    }}
                                />
                            </div>
                        ))
                    }
                </div>

                <div>
                    <Label htmlFor="eyeCatchingNote">Eye Catching Note</Label>
                    <Input
                        id="eyeCatchingNote"
                        value={eyeCatchingNote}
                        placeholder="Eye Catching Note"
                        onChange={(e) => {
                            setEyeCatchingNote(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>Know OMA</Label>
                        <Checkbox
                            id="knowOMA"
                            checked={knowOMA || false}
                            onCheckedChange={(checked) => setKnowOMA(!!checked)}
                        />
                    </div>
                    <div className="mt-2">
                        <Input
                            id="OMANotes"
                            value={OMANotes}
                            placeholder="OMA Notes"
                            onChange={(e) => {
                                setOMANotes(e.target.value);
                            }}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>Interest in Home Swapping</Label>
                        <Checkbox
                            id="interestInHomeSwapping"
                            checked={interestInHomeSwapping || false}
                            onCheckedChange={(checked) => setInterestInHomeSwapping(!!checked)}
                        />
                    </div>
                    <div className="mt-2">
                        <Input
                            id="interestInHomeSwappingNotes"
                            value={interestInHomeSwappingNotes}
                            placeholder="Interest in Home Swapping Notes"
                            onChange={(e) => {
                                setInterestInHomeSwappingNotes(e.target.value);
                            }}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="currentlyLivingIn">Currently Living In</Label>
                    <Input
                        id="currentlyLivingIn"
                        value={currentlyLivingIn}
                        placeholder="Currently Living In"
                        onChange={(e) => {
                            setCurrentlyLivingIn(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="currentLivingSituation">Current Living Situation</Label>
                    <Input
                        id="currentLivingSituation"
                        value={currentLivingSituation}
                        placeholder="Current Living Situation (eg. rental, lease expiring Feb 25; own a home they are selling)"
                        onChange={(e) => {
                            setCurrentLivingSituation(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>First Time Buyer</Label>
                        <Checkbox
                            id="firstTimeBuyer"
                            checked={firstTimeBuyer || false}
                            onCheckedChange={(checked) => setFirstTimeBuyer(!!checked)}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>Cash Buyer</Label>
                        <Checkbox
                            id="cashBuyer"
                            checked={cashBuyer || false}
                            onCheckedChange={(checked) => setCashBuyer(!!checked)}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>Broker</Label>
                        <Checkbox
                            id="broker"
                            checked={broker || false}
                            onCheckedChange={(checked) => setBroker(!!checked)}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>Attorney</Label>
                        <Checkbox
                            id="attorney"
                            checked={attorney || false}
                            onCheckedChange={(checked) => setAttorney(!!checked)}
                        />
                    </div>
                </div>

                <div>
                    <Label>
                        {`Who's Paying`}
                    </Label>
                    {
                        ["Self", "Parents", "Inheritance", "Other"].map((item) => (
                            <div key={item} className="flex items-center space-x-1">
                                <h1 className="text-sm">{item}</h1>
                                <Checkbox
                                    id={item}
                                    checked={whosPaying === item}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setWhosPaying(item);
                                        } else {
                                            setWhosPaying("");
                                        }
                                    }}
                                />
                            </div>
                        ))
                    }

                    {
                        whosPaying === "Other" && (
                            <Input
                                id="otherPayer"
                                value={otherPayer}
                                onChange={(e) => {
                                    setOtherPayer(e.target.value);
                                }}
                                placeholder="Other Payer"
                                className="mt-2"
                            />
                        )
                    }
                </div>

                <div>
                    <Label htmlFor="homeType">Home Type</Label>
                    <Select value={homeType || undefined} onValueChange={setHomeType}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a home type" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Primary Home", "Secondary Home"].map((homeTypeItem) => (
                                <SelectItem key={homeTypeItem} value={homeTypeItem} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                    {homeTypeItem}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="homePurchaseType">Home Purchase Type</Label>
                    <Select value={homePurchaseType || undefined} onValueChange={setHomePurchaseType}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a home purchase type" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Live In", "Investment"].map((homePurchaseTypeItem) => (
                                <SelectItem key={homePurchaseTypeItem} value={homePurchaseTypeItem} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                    {homePurchaseTypeItem}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>Mortgage Pre-Qualified</Label>
                        <Checkbox
                            id="mortgagePreQualified"
                            checked={mortgagePreQualified || false}
                            onCheckedChange={(checked) => setMortgagePreQualified(!!checked)}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>Wants Help Financing</Label>
                        <Checkbox
                            id="wantsHelpFinancing"
                            checked={wantsHelpFinancing || false}
                            onCheckedChange={(checked) => setWantsHelpFinancing(!!checked)}
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="lookingForCity">Looking For City</Label>
                    <Input
                        id="lookingForCity"
                        value={lookingForCity}
                        placeholder="Looking For City"
                        onChange={(e) => {
                            setLookingForCity(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="lookingForNeighborhood">Looking For Neighborhood</Label>
                    <Input
                        id="lookingForNeighborhood"
                        value={lookingForNeighborhood}
                        placeholder="Looking For Neighborhood"
                        onChange={(e) => {
                            setLookingForNeighborhood(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label>Looking For Unit Type</Label>
                    <Select value={lookingForUnitType || undefined} onValueChange={setLookingForUnitType}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a unit type" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ["Studio", "Townhouse", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Other"]
                                    .map((homePurchaseTypeItem) => (
                                        <SelectItem key={homePurchaseTypeItem} value={homePurchaseTypeItem} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                            {homePurchaseTypeItem}
                                        </SelectItem>
                                    ))}
                        </SelectContent>
                    </Select>

                    {
                        lookingForUnitType === "Other" && (
                            <Input
                                id="otherUnitType"
                                placeholder="Other Unit Type"
                                className="mt-2"
                                value={otherUnitType}
                                onChange={(e) => {
                                    setOtherUnitType(e.target.value);
                                }}
                            />
                        )
                    }
                </div>

                <div>
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-1">
                            <Label htmlFor="budget">Max Budget</Label>
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-center mt-1">
                        <div className="text-muted-foreground text-sm">
                            {sliderValueMax[0]?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
                        </div>
                    </div>
                    <Slider
                        value={sliderValueMax}
                        onValueChange={(value) => {
                            if (value[0] && sliderValue[0] && value[0] >= sliderValue[0]) {
                                setSliderValueMax(value);
                            }
                        }}
                        min={500_000}
                        max={2_000_000}
                        step={50_000}
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label>Buying Timeline</Label>
                    {
                        ["Immediate", "1-3", "3-6", "6-12", "12 - 18 mos", "18 - 24 mos", "24 months+"]
                            .map((timeline) => (
                                <div key={timeline} className="flex items-center space-x-1">
                                    <h1 className="text-sm">{timeline}</h1>
                                    <Checkbox
                                        id={timeline}
                                        checked={buyingTimeline.includes(timeline)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setBuyingTimeline([...buyingTimeline, timeline]);
                                            } else {
                                                setBuyingTimeline(buyingTimeline.filter((item) => item !== timeline));
                                            }
                                        }}
                                    />
                                </div>
                            ))
                    }
                </div>

                <div>
                    <Label>Funnel Type</Label>
                    <Select value={funnelType || undefined} onValueChange={setFunnelType}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a funnel type" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Real Buyer", "Window Shopper", "Long Term Lead", "Fan", "Unqualified"]
                                .map((funnelTypeItem) => (
                                    <SelectItem key={funnelTypeItem} value={funnelTypeItem} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                        {funnelTypeItem}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>

                    {
                        funnelType === "Real Buyer" && (
                            <div>
                                <Label>Real Buyer Timeline</Label>
                                <Select value={realBuyerTimeline || undefined} onValueChange={setRealBuyerTimeline}>
                                    <SelectTrigger className="w-full mt-1">
                                        <SelectValue placeholder="Select a real buyer timeline" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["Immediate", "Midterm", "Longterm"]
                                            .map((realBuyerTimelineItem) => (
                                                <SelectItem key={realBuyerTimelineItem} value={realBuyerTimelineItem} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                                    {realBuyerTimelineItem}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )
                    }
                </div>

                {/* multi checkbox */}
                <div>
                    <Label>Relevant Property</Label>
                    {
                        ["LES", "Bed Stuy", "Echo Park"].map((property) => (
                            <div key={property} className="flex items-center space-x-1">
                                <h1 className="text-sm">{property}</h1>
                                <Checkbox
                                    id={property}
                                    checked={relevantProperty.includes(property)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setRelevantProperty([...relevantProperty, property]);
                                        } else {
                                            setRelevantProperty(relevantProperty.filter((item) => item !== property));
                                        }
                                    }}
                                />
                            </div>
                        ))
                    }
                </div>

                <div>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>Travel For Work</Label>
                        <Checkbox
                            id="travelForWork"
                            checked={travelForWork || false}
                            onCheckedChange={(checked) => setTravelForWork(!!checked)}
                        />
                    </div>
                    <div className="mt-2">
                        <Input
                            id="travelFrequency"
                            value={travelFrequency}
                            placeholder="Travel Frequency"
                            onChange={(e) => {
                                setTravelFrequency(e.target.value);
                            }}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="familyAbroad">Family Abroad</Label>
                    <Input
                        id="familyAbroad"
                        value={familyAbroad}
                        placeholder="Family Abroad"
                        onChange={(e) => {
                            setFamilyAbroad(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="frequentedCities">Frequented Cities</Label>
                    <Input
                        id="frequentedCities"
                        value={frequentedCities}
                        placeholder="Frequented Cities"
                        onChange={(e) => {
                            setFrequentedCities(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="desiredCities">Desired Cities</Label>
                    <Input
                        id="desiredCities"
                        value={desiredCities}
                        placeholder="Desired Cities"
                        onChange={(e) => {
                            setDesiredCities(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label>Choose One</Label>
                    <Select value={necessityOrAmenity || undefined} onValueChange={setNecessityOrAmenity}>
                        <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select a necessity or amenity" />
                        </SelectTrigger>
                        <SelectContent>
                            {["Necessity", "Amenity"]
                                .map((item) => (
                                    <SelectItem key={item} value={item} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                        {item}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>How did they find home0001?</Label>
                    <Input
                        id="howTheyFoundHome0001"
                        value={howTheyFoundHome0001}
                        placeholder="How did they find home0001?"
                        onChange={(e) => {
                            setHowTheyFoundHome0001(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label>What sparked their interest?</Label>
                    <Input
                        id="whatSparkInterest"
                        value={whatSparkInterest}
                        placeholder="What sparked their interest?"
                        onChange={(e) => {
                            setWhatSparkInterest(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label>What do they like about apartments?</Label>
                    <Input
                        id="whatTheyLikeAboutApartments"
                        value={whatTheyLikeAboutApartments}
                        placeholder="What do they like about apartments?"
                        onChange={(e) => {
                            setWhatTheyLikeAboutApartments(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label>{`What don't they like about apartments?`}</Label>
                    <Input
                        id="whatTheyDontLikeAboutApartments"
                        value={whatTheyDontLikeAboutApartments}
                        placeholder={`What don't they like about apartments?`}
                        onChange={(e) => {
                            setWhatTheyDontLikeAboutApartments(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label>Which other neighborhoods do they like?</Label>
                    <Input
                        id="otherNeighborhoods"
                        value={otherNeighborhoods}
                        placeholder="Which other neighborhoods do they like?"
                        onChange={(e) => {
                            setOtherNeighborhoods(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label>Which other cities do they like?</Label>
                    <Input
                        id="otherCities"
                        value={otherCities}
                        placeholder="Which other cities do they like?"
                        onChange={(e) => {
                            setOtherCities(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label>Additional Notes:</Label>
                    <Input
                        id="additionalNotes"
                        value={additionalNotes}
                        placeholder="Additional Notes"
                        onChange={(e) => {
                            setAdditionalNotes(e.target.value);
                        }}
                        className="mt-1"
                    />
                </div>
                <Button
                    onClick={onSubmit}
                >
                    {isLoading ? <Spinner /> : "Update User Profile"}
                </Button>
            </div>}
        </div>
    );
};

export default UpdateProfile;
