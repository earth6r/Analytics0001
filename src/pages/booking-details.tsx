import Header from "@/components/common/header";
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatTimestamp } from "@/lib/utils";
import { api } from "@/utils/api";
import { AlertCircle, ArrowLeft, ArrowLeftCircleIcon, Bell, Calendar, CircleAlert, CircleOff, Contact, Facebook, FileQuestion, Flame, Globe, Hourglass, Instagram, Mail, MapPin, NotepadText, Phone, School, Snowflake, SquareArrowOutUpRight, ThermometerSun, Timer, Trash2, TriangleAlert, Twitter, X } from "lucide-react";
import { useRouter } from "next/router";
import AddImageToUserDialog from "@/components/bookings/add-image-to-user-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CopyTooltip from "@/components/customers/copy-tooltip";
import { useInterval } from "@/contexts/IntervalContext";
import { nextStepsMapping } from "@/components/bookings/next-steps-dropdown";
import moment from "moment";
import DeleteNextStepChainLink from "@/components/bookings/delete-next-step-chain-link";
import UpdateProfile from "@/components/update-profile";
import HotWarmColdSelect from "@/components/hot-warm-cold-select";
import { Separator } from "@/components/ui/separator";
import { FaWhatsapp } from "react-icons/fa";
import { FaSignalMessenger } from "react-icons/fa6";
import AddSocialsDialog from "@/components/add-socials-dialog";
import Spinner from "@/components/common/spinner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

export const ZOOM_URL = "https://zoom.us/j/9199989063?pwd=RzhRMklXNWdJNGVKZjRkRTdkUmZOZz09";

// TODO: rename component and page to user-details
const BookingDetails = () => {
    const router = useRouter();

    const { email, type, uid, referral } = router.query;
    const [displayImageUrl, setDisplayImageUrl] = useState<string | undefined>(undefined);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [nextStepsAction, setNextStepsAction] = useState<string | null>(null);
    const [latestNextStep, setLatestNextStep] = useState<any | null>(null);

    const [HotWarmColdEditMode, setHotWarmColdEditMode] = useState<boolean>(false);

    const [professionEditMode, setProfessionEditMode] = useState<boolean>(false);
    const [profession, setProfession] = useState<string>("");
    const [otherProfession, setOtherProfession] = useState<string>("");

    const [ageEditMode, setAgeEditMode] = useState<boolean>(false);
    const [age, setAge] = useState<number>(0);

    const [kidsEditMode, setKidsEditMode] = useState<boolean>(false);
    const [kids, setKids] = useState<number>(0);

    const [relationshipStatusEditMode, setRelationshipStatusEditMode] = useState<boolean>(false);
    const [relationshipStatus, setRelationshipStatus] = useState<string>("");

    const [hasPets, setHasPets] = useState<boolean>(false);
    const [petsEditMode, setPetsEditMode] = useState<boolean>(false);
    const [petCount, setPetCount] = useState<number>(1);
    const [petTypes, setPetTypes] = useState<string[]>([""]);

    const [personalityTypeEditMode, setPersonalityTypeEditMode] = useState<boolean>(false);
    const [otherPersonality, setOtherPersonality] = useState<string>("");
    const [personalityType, setPersonalityType] = useState<string>("");

    const [firstTimeBuyerEditMode, setFirstTimeBuyerEditMode] = useState<boolean>(false);
    const [firstTimeBuyer, setFirstTimeBuyer] = useState<boolean | null>(null);

    const [cashBuyerEditMode, setCashBuyerEditMode] = useState<boolean>(false);
    const [cashBuyer, setCashBuyer] = useState<boolean | null>(null);

    const [brokerEditMode, setBrokerEditMode] = useState<boolean>(false);
    const [broker, setBroker] = useState<boolean | null>(null);

    const [bio, setBio] = useState<string>("");
    const [bioEditMode, setBioEditMode] = useState<boolean>(false);

    const [attorneyEditMode, setAttorneyEditMode] = useState<boolean>(false);
    const [attorney, setAttorney] = useState<boolean | null>(null);

    const [whosPayingEditMode, setWhosPayingEditMode] = useState<boolean>(false);
    const [whosPaying, setWhosPaying] = useState<string>("");
    const [otherPayer, setOtherPayer] = useState<string>("");

    const [mortgagePreQualifiedEditMode, setMortgagePreQualifiedEditMode] = useState<boolean | null>(null);
    const [mortgagePreQualified, setMortgagePreQualified] = useState<boolean | null>(null);

    const [homePurchaseTypeEditMode, setHomePurchaseTypeEditMode] = useState<boolean>(false);
    const [homePurchaseType, setHomePurchaseType] = useState<string>("");

    const [wantsHelpFinancingEditMode, setWantsHelpFinancingEditMode] = useState<boolean>(false);
    const [wantsHelpFinancing, setWantsHelpFinancing] = useState<boolean | null>(null);

    const [necessityOrAmenityEditMode, setNecessityOrAmenityEditMode] = useState<boolean>(false);
    const [necessityOrAmenity, setNecessityOrAmenity] = useState<string>("");

    const [funnelTypeEditMode, setFunnelTypeEditMode] = useState<boolean>(false);

    const [communityScoreEditMode, setCommunityScoreEditMode] = useState<boolean>(false);
    const [communityScore, setCommunityScore] = useState<number>(0);

    const [relevanceEditMode, setRelevanceEditMode] = useState<boolean>(false);
    const [relevance, setRelevance] = useState<string[]>([]);

    const [knowOMA, setKnowOMA] = useState<boolean | null>(null);
    const [knowOMAEditMode, setKnowOMAEditMode] = useState<boolean>(false);

    const [interestInHomeSwappingEditMode, setInterestInHomeSwappingEditMode] = useState<boolean>(false);
    const [interestInHomeSwapping, setInterestInHomeSwapping] = useState<boolean | null>(null);

    const [interestInFurnitureEditMode, setInterestInFurnitureEditMode] = useState<boolean>(false);
    const [interestInFurniture, setInterestInFurniture] = useState<boolean | null>(null);

    const [homeType, setHomeType] = useState<string>("");
    const [homeTypeEditMode, setHomeTypeEditMode] = useState<boolean>(false);

    const [lookingForUnitType, setLookingForUnitType] = useState<string>("");
    const [lookingForUnitTypeEditMode, setLookingForUnitTypeEditMode] = useState<boolean>(false);

    const [sliderValueMax, setSliderValueMax] = useState<number[] | null>(null);
    const [maxBudgetEditMode, setMaxBudgetEditMode] = useState<boolean>(false);

    const [buyingTimeline, setBuyingTimeline] = useState<string[]>([]);
    const [buyingTimelineEditMode, setBuyingTimelineEditMode] = useState<boolean>(false);

    const [travelForWork, setTravelForWork] = useState<boolean | null>(null);
    const [travelForWorkEditMode, setTravelForWorkEditMode] = useState<boolean>(false);

    const [travelFrequency, setTravelFrequency] = useState<string>("");
    const [travelFrequencyEditMode, setTravelFrequencyEditMode] = useState<boolean>(false);

    const [familyAbroad, setFamilyAbroad] = useState<string>("");
    const [familyAbroadEditMode, setFamilyAbroadEditMode] = useState<boolean>(false);

    const [frequentedCities, setFrequentedCities] = useState<string>("");
    const [desiredCities, setDesiredCities] = useState<string>("");
    const [otherCities, setOtherCities] = useState<string>("");
    const [frequentedCitiesEditMode, setFrequentedCitiesEditMode] = useState<boolean>(false);
    const [desiredCitiesEditMode, setDesiredCitiesEditMode] = useState<boolean>(false);
    const [otherCitiesEditMode, setOtherCitiesEditMode] = useState<boolean>(false);

    const [otherNeighborhoods, setOtherNeighborhoods] = useState<string>("");
    const [otherNeighborhoodsEditMode, setOtherNeighborhoodsEditMode] = useState<boolean>(false);

    const [relevantProperty, setRelevantProperty] = useState<string[]>([]); // LES, Bed Stuy, Echo Park
    const [relevantPropertyEditMode, setRelevantPropertyEditMode] = useState<boolean>(false);

    const [currentLivingSituation, setCurrentLivingSituation] = useState<string>("");
    const [currentLivingSituationEditMode, setCurrentLivingSituationEditMode] = useState<boolean>(false);

    const [currentlyLivingIn, setCurrentlyLivingIn] = useState<string>("");
    const [currentlyLivingInEditMode, setCurrentlyLivingInEditMode] = useState<boolean>(false);

    const [lookingForCity, setLookingForCity] = useState<string>("");
    const [lookingForCityEditMode, setLookingForCityEditMode] = useState<boolean>(false);
    const [lookingForNeighborhood, setLookingForNeighborhood] = useState<string>("");
    const [lookingForNeighborhoodEditMode, setLookingForNeighborhoodEditMode] = useState<boolean>(false);

    const [personalNotesEditMode, setPersonalNotesEditMode] = useState<boolean>(false);
    const [personalNotes, setPersonalNotes] = useState<string>("");

    const [communityFit, setCommunityFit] = useState<string>("");
    const [communityFitEditMode, setCommunityFitEditMode] = useState<boolean>(false);
    const [eyeCatchingNote, setEyeCatchingNote] = useState<string>("");
    const [eyeCatchingNoteEditMode, setEyeCatchingNoteEditMode] = useState<boolean>(false);
    const [howTheyFoundHome0001, setHowTheyFoundHome0001] = useState<string>("");
    const [howTheyFoundHome0001EditMode, setHowTheyFoundHome0001EditMode] = useState<boolean>(false);
    const [whatSparkInterest, setWhatSparkInterest] = useState<string>("");
    const [whatSparkInterestEditMode, setWhatSparkInterestEditMode] = useState<boolean>(false);
    const [whatTheyLikeAboutApartments, setWhatTheyLikeAboutApartments] = useState<string>("");
    const [whatTheyLikeAboutApartmentsEditMode, setWhatTheyLikeAboutApartmentsEditMode] = useState<boolean>(false);
    const [whatTheyDontLikeAboutApartments, setWhatTheyDontLikeAboutApartments] = useState<string>("");
    const [whatTheyDontLikeAboutApartmentsEditMode, setWhatTheyDontLikeAboutApartmentsEditMode] = useState<boolean>(false);
    const [additionalNotes, setAdditionalNotes] = useState<string>("");
    const [additionalNotesEditMode, setAdditionalNotesEditMode] = useState<boolean>(false);
    const [OMANotes, setOMANotes] = useState<string>("");
    const [OMANotesEditMode, setOMANotesEditMode] = useState<boolean>(false);

    const [gender, setGender] = useState<string>("");
    const [genderEditMode, setGenderEditMode] = useState<boolean>(false);

    const [funnelType, setFunnelType] = useState<string>("");

    const [realBuyerTimeline, setRealBuyerTimeline] = useState<string>("");

    const [interestInFurnitureNotesEditMode, setInterestInFurnitureNotesEditMode] = useState<boolean>(false);
    const [interestInFurnitureNotes, setInterestInFurnitureNotes] = useState<string>("");

    const [interestInHomeSwappingNotesEditMode, setInterestInHomeSwappingNotesEditMode] = useState<boolean>(false);
    const [interestInHomeSwappingNotes, setInterestInHomeSwappingNotes] = useState<string>("");

    const [maxBookingsToShow, setMaxBookingsToShow] = useState<number>(2);

    const { timezone } = useInterval();

    const bookingDetails = api.bookings.getBookingDetails.useQuery(
        {
            email: email as string,
            type: type as string,
            uid: uid as string,
        },
        {
            enabled: !!email && !!type && !!uid,
        }
    );

    // TODO: make a specific query for bookings by email for efficiency
    const bookings = api.bookings.getBookings.useQuery(
        {
            email: email as string,
        },
        {
            enabled: !!email,
        }
    );

    const registerDetails = api.register.getRegisterDetails.useQuery(
        {
            email: email as string,
        },
        {
            enabled: !!email,
        }
    );

    const getPotentialCustomerDetails = api.user.getPotentialCustomerDetails.useQuery(
        {
            email: email as string,
        },
        {
            enabled: !!email,
        }
    );

    const setHotWarmCold = api.user.setHotWarmCold.useMutation();
    const updateProfession = api.user.updateProfession.useMutation();
    const updateAge = api.user.updateAge.useMutation();
    const updateKids = api.user.updateKids.useMutation();
    const updateRelationshipStatus = api.user.updateRelationshipStatus.useMutation();
    const updatePets = api.user.updatePets.useMutation();
    const updatePersonalityType = api.user.updatePersonalityType.useMutation();
    const updateFirstTimeBuyer = api.user.updateFirstTimeBuyer.useMutation();
    const updateCashBuyer = api.user.updateCashBuyer.useMutation();
    const updateBroker = api.user.updateBroker.useMutation();
    const updateAttorney = api.user.updateAttorney.useMutation();
    const updateWhosPaying = api.user.updateWhosPaying.useMutation();
    const updateMortgagePreQualified = api.user.updateMortgagePreQualified.useMutation();
    const updateHomePurchaseType = api.user.updateHomePurchaseType.useMutation();
    const updateWantsHelpFinancing = api.user.updateWantsHelpFinancing.useMutation();
    const updateNecessityOrAmenity = api.user.updateNecessityOrAmenity.useMutation();
    const updateCommunityScore = api.user.updateCommunityScore.useMutation();
    const updateRelevance = api.user.updateRelevance.useMutation();
    const updateKnowOMA = api.user.updateKnowOMA.useMutation();
    const updateInterestInHomeSwapping = api.user.updateInterestInHomeSwapping.useMutation();
    const updateInterestInFurniture = api.user.updateInterestInFurniture.useMutation();
    const updateHomeType = api.user.updateHomeType.useMutation();
    const updateLookingForUnitType = api.user.updateLookingForUnitType.useMutation();
    const updateMaxBudget = api.user.updateMaxBudget.useMutation();
    const updateBuyingTimeline = api.user.updateBuyingTimeline.useMutation();
    const updateTravelForWork = api.user.updateTravelForWork.useMutation();
    const updateTravelFrequency = api.user.updateTravelFrequency.useMutation();
    const updateFamilyAbroad = api.user.updateFamilyAbroad.useMutation();
    const updateFrequentedCities = api.user.updateFrequentedCities.useMutation();
    const updateDesiredCities = api.user.updateDesiredCities.useMutation();
    const updateOtherCities = api.user.updateOtherCities.useMutation();
    const updateRelevantProperty = api.user.updateRelevantProperty.useMutation();
    const updateCurrentLivingSituation = api.user.updateCurrentLivingSituation.useMutation();
    const updateCurrentlyLivingIn = api.user.updateCurrentlyLivingIn.useMutation();
    const updateLookingForCity = api.user.updateLookingForCity.useMutation();
    const updateLookingForNeighborhood = api.user.updateLookingForNeighborhood.useMutation();
    const updatePersonalNotes = api.user.updatePersonalNotes.useMutation();
    const updateCommunityFit = api.user.updateCommunityFit.useMutation();
    const updateEyeCatchingNote = api.user.updateEyeCatchingNote.useMutation();
    const updateHowTheyFoundHome0001 = api.user.updateHowTheyFoundHome0001.useMutation();
    const updateWhatSparkInterest = api.user.updateWhatSparkInterest.useMutation();
    const updateWhatTheyLikeAboutApartments = api.user.updateWhatTheyLikeAboutApartments.useMutation();
    const updateWhatTheyDontLikeAboutApartments = api.user.updateWhatTheyDontLikeAboutApartments.useMutation();
    const updateAdditionalNotes = api.user.updateAdditionalNotes.useMutation();
    const updateOMANotes = api.user.updateOMANotes.useMutation();
    const updateBio = api.user.updateBio.useMutation();
    const updateFunnelType = api.user.updateFunnelType.useMutation();
    const updateInterestInFurnitureNotes = api.user.updateInterestInFurnitureNotes.useMutation();
    const updateInterestInHomeSwappingNotes = api.user.updateInterestInHomeSwappingNotes.useMutation();
    const updateOtherNeighborhoods = api.user.updateOtherNeighborhoods.useMutation();
    const updateRealBuyerTimeline = api.user.updateRealBuyerTimeline.useMutation();
    const updateGender = api.user.updateGender.useMutation();

    useEffect(() => {
        if (getPotentialCustomerDetails.data?.imageUrl) {
            setDisplayImageUrl(getPotentialCustomerDetails.data.imageUrl);
        } else if (bookingDetails.data?.firstName && bookingDetails.data?.lastName) {
            setDisplayImageUrl(`https://ui-avatars.com/api/?name=${bookingDetails.data?.firstName + " " + bookingDetails.data?.lastName}`);
        }
    }, [getPotentialCustomerDetails.data?.imageUrl, bookingDetails.data?.firstName, bookingDetails.data?.lastName]);

    useEffect(() => {
        if (getPotentialCustomerDetails.data?.profession) {
            setProfession(getPotentialCustomerDetails.data.profession);
        }

        if (getPotentialCustomerDetails.data?.age) {
            setAge(getPotentialCustomerDetails.data.age);
        }

        if (getPotentialCustomerDetails.data?.kids) {
            setKids(getPotentialCustomerDetails.data.kids);
        }

        if (getPotentialCustomerDetails.data?.relationshipStatus) {
            setRelationshipStatus(getPotentialCustomerDetails.data.relationshipStatus);
        }

        if (getPotentialCustomerDetails.data?.hasPets) {
            setHasPets(getPotentialCustomerDetails.data.hasPets);
        }

        if (getPotentialCustomerDetails.data?.petTypes) {
            setPetTypes(getPotentialCustomerDetails.data.petTypes);
            setPetCount(getPotentialCustomerDetails.data.petTypes.length);
        }

        if (getPotentialCustomerDetails.data?.personalityType) {
            setPersonalityType(getPotentialCustomerDetails.data.personalityType);
        }

        if (getPotentialCustomerDetails.data?.firstTimeBuyer !== null && getPotentialCustomerDetails.data?.firstTimeBuyer !== undefined) {
            setFirstTimeBuyer(getPotentialCustomerDetails.data.firstTimeBuyer);
        }

        if (getPotentialCustomerDetails.data?.cashBuyer !== null && getPotentialCustomerDetails.data?.cashBuyer !== undefined) {
            setCashBuyer(getPotentialCustomerDetails.data.cashBuyer);
        }

        if (getPotentialCustomerDetails.data?.broker !== null && getPotentialCustomerDetails.data?.broker !== undefined) {
            setBroker(getPotentialCustomerDetails.data.broker);
        }

        if (getPotentialCustomerDetails.data?.attorney !== null && getPotentialCustomerDetails.data?.attorney !== undefined) {
            setAttorney(getPotentialCustomerDetails.data.attorney);
        }

        setWhosPaying(getPotentialCustomerDetails.data?.whosPaying || "");

        if (getPotentialCustomerDetails.data?.mortgagePreQualified !== null && getPotentialCustomerDetails.data?.mortgagePreQualified !== undefined) {
            setMortgagePreQualified(getPotentialCustomerDetails.data.mortgagePreQualified);
        }

        setHomePurchaseType(getPotentialCustomerDetails.data?.homePurchaseType || "");

        if (getPotentialCustomerDetails.data?.wantsHelpFinancing !== null && getPotentialCustomerDetails.data?.wantsHelpFinancing !== undefined) {
            setWantsHelpFinancing(getPotentialCustomerDetails.data.wantsHelpFinancing);
        }

        setNecessityOrAmenity(getPotentialCustomerDetails.data?.necessityOrAmenity || "");

        setCommunityScore(getPotentialCustomerDetails.data?.communityScore || 0);

        setRelevance(getPotentialCustomerDetails.data?.relevance || []);

        if (getPotentialCustomerDetails.data?.knowOMA !== null && getPotentialCustomerDetails.data?.knowOMA !== undefined) {
            setKnowOMA(getPotentialCustomerDetails.data.knowOMA);
        }

        if (getPotentialCustomerDetails.data?.interestInHomeSwapping !== null && getPotentialCustomerDetails.data?.interestInHomeSwapping !== undefined) {
            setInterestInHomeSwapping(getPotentialCustomerDetails.data.interestInHomeSwapping);
        }

        if (getPotentialCustomerDetails.data?.interestInFurniture !== null && getPotentialCustomerDetails.data?.interestInFurniture !== undefined) {
            setInterestInFurniture(getPotentialCustomerDetails.data.interestInFurniture);
        }

        if (getPotentialCustomerDetails.data?.homeType) {
            setHomeType(getPotentialCustomerDetails.data.homeType);
        }

        if (getPotentialCustomerDetails.data?.lookingForUnitType) {
            setLookingForUnitType(getPotentialCustomerDetails.data.lookingForUnitType);
        }

        if (getPotentialCustomerDetails.data?.maxBudget) {
            setSliderValueMax([getPotentialCustomerDetails.data.maxBudget]);
        }

        if (getPotentialCustomerDetails.data?.buyingTimeline) {
            setBuyingTimeline(getPotentialCustomerDetails.data.buyingTimeline);
        }

        if (getPotentialCustomerDetails.data?.travelForWork !== null && getPotentialCustomerDetails.data?.travelForWork !== undefined) {
            setTravelForWork(getPotentialCustomerDetails.data.travelForWork);
        }

        if (getPotentialCustomerDetails.data?.travelFrequency) {
            setTravelFrequency(getPotentialCustomerDetails.data.travelFrequency);
        }

        if (getPotentialCustomerDetails.data?.familyAbroad) {
            setFamilyAbroad(getPotentialCustomerDetails.data.familyAbroad);
        }

        if (getPotentialCustomerDetails.data?.frequentedCities) {
            setFrequentedCities(getPotentialCustomerDetails.data.frequentedCities);
        }

        if (getPotentialCustomerDetails.data?.desiredCities) {
            setDesiredCities(getPotentialCustomerDetails.data.desiredCities);
        }

        if (getPotentialCustomerDetails.data?.otherCities) {
            setOtherCities(getPotentialCustomerDetails.data.otherCities);
        }

        if (getPotentialCustomerDetails.data?.relevantProperty) {
            setRelevantProperty(getPotentialCustomerDetails.data.relevantProperty);
        }

        if (getPotentialCustomerDetails.data?.currentLivingSituation) {
            setCurrentLivingSituation(getPotentialCustomerDetails.data.currentLivingSituation);
        }

        if (getPotentialCustomerDetails.data?.currentlyLivingIn) {
            setCurrentlyLivingIn(getPotentialCustomerDetails.data.currentlyLivingIn);
        }

        if (getPotentialCustomerDetails.data?.lookingForCity) {
            setLookingForCity(getPotentialCustomerDetails.data.lookingForCity);
        }

        if (getPotentialCustomerDetails.data?.lookingForNeighborhood) {
            setLookingForNeighborhood(getPotentialCustomerDetails.data.lookingForNeighborhood);
        }

        if (getPotentialCustomerDetails.data?.personalNotes) {
            setPersonalNotes(getPotentialCustomerDetails.data.personalNotes);
        }

        if (getPotentialCustomerDetails.data?.communityFit) {
            setCommunityFit(getPotentialCustomerDetails.data.communityFit);
        }

        if (getPotentialCustomerDetails.data?.eyeCatchingNote) {
            setEyeCatchingNote(getPotentialCustomerDetails.data.eyeCatchingNote);
        }

        if (getPotentialCustomerDetails.data?.howTheyFoundHome0001) {
            setHowTheyFoundHome0001(getPotentialCustomerDetails.data.howTheyFoundHome0001);
        }

        if (getPotentialCustomerDetails.data?.whatSparkInterest) {
            setWhatSparkInterest(getPotentialCustomerDetails.data.whatSparkInterest);
        }

        if (getPotentialCustomerDetails.data?.whatTheyLikeAboutApartments) {
            setWhatTheyLikeAboutApartments(getPotentialCustomerDetails.data.whatTheyLikeAboutApartments);
        }

        if (getPotentialCustomerDetails.data?.whatTheyDontLikeAboutApartments) {
            setWhatTheyDontLikeAboutApartments(getPotentialCustomerDetails.data.whatTheyDontLikeAboutApartments);
        }

        if (getPotentialCustomerDetails.data?.additionalNotes) {
            setAdditionalNotes(getPotentialCustomerDetails.data.additionalNotes);
        }

        if (getPotentialCustomerDetails.data?.OMANotes) {
            setOMANotes(getPotentialCustomerDetails.data.OMANotes);
        }

        if (getPotentialCustomerDetails.data?.bio) {
            setBio(getPotentialCustomerDetails.data.bio);
        }

        if (getPotentialCustomerDetails.data?.funnelType) {
            setFunnelType(getPotentialCustomerDetails.data.funnelType);
        }

        if (getPotentialCustomerDetails.data?.interestInFurnitureNotes) {
            setInterestInFurnitureNotes(getPotentialCustomerDetails.data.interestInFurnitureNotes);
        }

        if (getPotentialCustomerDetails.data?.interestInHomeSwappingNotes) {
            setInterestInHomeSwappingNotes(getPotentialCustomerDetails.data.interestInHomeSwappingNotes);
        }

        if (getPotentialCustomerDetails.data?.otherNeighborhoods) {
            setOtherNeighborhoods(getPotentialCustomerDetails.data.otherNeighborhoods);
        }

        if (getPotentialCustomerDetails.data?.realBuyerTimeline) {
            setRealBuyerTimeline(getPotentialCustomerDetails.data.realBuyerTimeline);
        }

        if (getPotentialCustomerDetails.data?.gender) {
            setGender(getPotentialCustomerDetails.data.gender);
        }
    }, [getPotentialCustomerDetails.data]);

    useEffect(() => {
        if (getPotentialCustomerDetails.data?.nextStepsDropdownValue && getPotentialCustomerDetails.data?.nextStepsDropdownValue.length > 0) {
            setNextStepsAction(getPotentialCustomerDetails.data?.nextStepsDropdownValue[getPotentialCustomerDetails.data?.nextStepsDropdownValue.length - 1].value);
            setLatestNextStep(getPotentialCustomerDetails.data?.nextStepsDropdownValue[getPotentialCustomerDetails.data?.nextStepsDropdownValue.length - 1]);
        } else {
            setNextStepsAction(null);
        }
    }, [getPotentialCustomerDetails.data?.nextStepsDropdownValue]);

    if (
        !registerDetails.isLoading &&
        !registerDetails.data &&
        !bookingDetails.isLoading &&
        !bookingDetails.data
    ) {
        // TODO: make this ui better https://github.com/users/apinanyogaratnam/projects/35/views/1?pane=issue&itemId=73914135
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-3xl font-bold">No waitlist details found</div>
                <div className="text-lg">Please try again later</div>
                <div className="mt-4">
                    <Button variant="default" onClick={() => referral ? router.push(referral as string) : router.push("/bookings")}>Go back</Button>
                </div>
            </div>
        );
    }

    const createHyperlinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part: string, index: number) => {
            if (urlRegex.test(part)) {
                // return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
                return (
                    <TooltipTrigger key={index}>
                        <div key={index} className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={
                            () => window.open(
                                part,
                                "_blank"
                            )
                        }>{part}
                        </div>
                    </TooltipTrigger>
                );
            }
            return part;
        });
    };

    const registerData = registerDetails.data?.data;

    return (
        <div>
            <Header />
            <div className="p-6">
                <div className="flex flex-row items-center justify-start">
                    <div
                        className="flex flex-row items-center space-x-0.5 cursor-pointer text-muted-foreground hover:text-foreground select-none"
                        onClick={
                            () => referral ? router.push(referral as string) : router.push("/bookings")
                        }
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <h1 className="">Back to main site</h1>
                    </div>
                </div>

                <div className="flex flex-row items-start justify-between mt-4">
                    <div>
                        {
                            getPotentialCustomerDetails.isLoading ?
                                <Skeleton className="w-52 h-10" /> :
                                <div>
                                    <h1 className="text-3xl font-bold truncate max-w-52 md:max-w-80 lg:max-w-96">
                                        {
                                            getPotentialCustomerDetails.data ? (getPotentialCustomerDetails.data?.firstName + " " + getPotentialCustomerDetails.data?.lastName) : (registerDetails.data?.data?.firstName + " " + registerDetails.data?.data?.lastName)
                                        }
                                    </h1>
                                    <div className="text-muted-foreground">
                                        {email}
                                    </div>
                                    <div className="flex flex-row items-center space-x-1">
                                        {getPotentialCustomerDetails.data?.website &&
                                            <Globe
                                                className="w-6 h-6 hover:text-blue-500 cursor-pointer"
                                                onClick={
                                                    () => {
                                                        window.open(getPotentialCustomerDetails.data?.website, "_blank")
                                                    }
                                                }
                                            />
                                        }
                                        {getPotentialCustomerDetails.data?.instagram &&
                                            <Instagram
                                                className="w-6 h-6 hover:text-blue-500 cursor-pointer"
                                                onClick={
                                                    () => {
                                                        window.open(getPotentialCustomerDetails.data?.instagram, "_blank")
                                                    }
                                                }
                                            />
                                        }
                                        {getPotentialCustomerDetails.data?.facebook &&
                                            <Facebook
                                                className="w-6 h-6 hover:text-blue-500 cursor-pointer"
                                                onClick={
                                                    () => {
                                                        window.open(getPotentialCustomerDetails.data?.facebook, "_blank")
                                                    }
                                                }
                                            />
                                        }
                                        {getPotentialCustomerDetails.data?.twitter &&
                                            <Twitter
                                                className="w-6 h-6 hover:text-blue-500 cursor-pointer"
                                                onClick={
                                                    () => {
                                                        window.open(getPotentialCustomerDetails.data?.twitter, "_blank")
                                                    }
                                                }
                                            />
                                        }
                                        {getPotentialCustomerDetails.data?.whatsApp &&
                                            <FaWhatsapp
                                                className="w-6 h-6 hover:text-green-500 cursor-pointer"
                                                onClick={
                                                    () => {
                                                        window.open(getPotentialCustomerDetails.data?.whatsApp, "_blank")
                                                    }
                                                }
                                            />
                                        }
                                        {getPotentialCustomerDetails.data?.signal &&
                                            <FaSignalMessenger
                                                className="w-6 h-6 hover:text-blue-500 cursor-pointer"
                                                onClick={
                                                    () => {
                                                        window.open(getPotentialCustomerDetails.data?.signal, "_blank")
                                                    }
                                                }
                                            />
                                        }
                                        <AddSocialsDialog
                                            potentialCustomer={getPotentialCustomerDetails.data}
                                            refetchPotentialCustomers={getPotentialCustomerDetails.refetch}
                                        />
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="flex flex-row items-center space-x-2 select-none">
                        <AddImageToUserDialog initialLoading={getPotentialCustomerDetails.isLoading || getPotentialCustomerDetails.isError || getPotentialCustomerDetails.isFetching || getPotentialCustomerDetails.isPending} email={email as string} refetch={getPotentialCustomerDetails.refetch} potentialCustomerData={getPotentialCustomerDetails.data} />
                        {/* TODO: fix issue of image not showing in mobile view */}
                    </div>
                </div>

                {registerDetails.data && registerDetails.data.count > 1 &&
                    <Alert className="mt-4">
                        <div className="flex flex-row space-x-1">
                            <div className="text-yellow-500">
                                <TriangleAlert className="h-4 w-4" />
                            </div>
                            <AlertTitle>Heads up!</AlertTitle>
                        </div>
                        <AlertDescription>
                            There are multiple waitlist details for this email. We will show as many details as possible.
                        </AlertDescription>
                    </Alert>
                }

                <div className="flex flex-row items-start justify-between mt-6">
                    <div className="flex flex-row items-start space-x-8">
                        <div className="relative w-[400px] h-[400px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={displayImageUrl as string}
                                alt="@user"
                                className="object-contain h-full w-full"
                                onLoad={() => { setImageLoaded(true) }}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-row items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <div>
                                    <CopyTooltip value={email as string} />
                                </div>
                            </div>
                            <div className="flex flex-row items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <div>
                                    {bookingDetails.data?.phoneNumber ? <CopyTooltip value={bookingDetails.data?.phoneNumber} /> : "-"}
                                </div>
                            </div>
                            {genderEditMode ? <div>
                                <div className="flex flex-row items-center space-x-2">
                                    <Input
                                        type="text"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    <div
                                        className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                        onClick={async () => {
                                            await updateGender.mutateAsync({
                                                email: email as string,
                                                gender,
                                            })
                                            await getPotentialCustomerDetails.refetch();
                                            setGenderEditMode(false)
                                        }}
                                    >
                                        Done
                                    </div>
                                </div>
                            </div> :
                                <div className="flex flex-row items-center space-x-2">
                                    <h1>
                                        Identifies as a {getPotentialCustomerDetails.data?.gender || "-"}
                                    </h1>
                                    <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setGenderEditMode(true)}>
                                        Edit
                                    </div>
                                </div>
                            }
                            <div>
                                {ageEditMode ?
                                    <div className="flex flex-row items-center space-x-2">
                                        <Input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(parseInt(e.target.value))}
                                        />
                                        <div
                                            className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                            onClick={async () => {
                                                await updateAge.mutateAsync({
                                                    email: email as string,
                                                    age: age,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setAgeEditMode(false)
                                            }}
                                        >
                                            Done
                                        </div>
                                    </div> :
                                    <div className="flex flex-row items-center space-x-2">
                                        <h1>
                                            {getPotentialCustomerDetails.data?.age || "-"} years old
                                        </h1>
                                        <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setAgeEditMode(true)}>
                                            Edit
                                        </div>
                                    </div>
                                }
                            </div>
                            <div>
                                {professionEditMode ?
                                    <div className="flex flex-row items-center space-x-2">
                                        <div>
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
                                        <div
                                            className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                            onClick={async () => {
                                                await updateProfession.mutateAsync({
                                                    email: email as string,
                                                    profession: profession === "Other" ? otherProfession : profession,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setProfessionEditMode(false)
                                            }}
                                        >
                                            Done
                                        </div>
                                    </div> :
                                    <div className="flex flex-row items-center space-x-2">
                                        <h1>
                                            Works in {getPotentialCustomerDetails.data?.profession || "-"}
                                        </h1>
                                        <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setProfessionEditMode(true)}>
                                            Edit
                                        </div>
                                    </div>
                                }
                            </div>
                            {
                                HotWarmColdEditMode ?
                                    <div className="flex flex-row items-center space-x-2">
                                        <HotWarmColdSelect
                                            value={getPotentialCustomerDetails.data?.hotWarmCold}
                                            onChange={async (value) => {
                                                await setHotWarmCold.mutateAsync({
                                                    email: email as string,
                                                    hotWarmCold: value,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                            }}
                                        />
                                        <div className="flex flex-row items-center space-x-2">
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setHotWarmColdEditMode(false)}>
                                                Done
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="flex flex-row items-center space-x-2">
                                        <div
                                            className={
                                                cn(
                                                    "capitalize flex flex-row items-center",
                                                    getPotentialCustomerDetails.data?.hotWarmCold === "hot" && "text-red-500",
                                                    getPotentialCustomerDetails.data?.hotWarmCold === "warm" && "text-yellow-500",
                                                    getPotentialCustomerDetails.data?.hotWarmCold === "cold" && "text-blue-500",
                                                )
                                            }
                                        >
                                            <div>
                                                {getPotentialCustomerDetails.data?.hotWarmCold === "hot" && <Flame className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                {getPotentialCustomerDetails.data?.hotWarmCold === "cold" && <Snowflake className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                {getPotentialCustomerDetails.data?.hotWarmCold === "warm" && <ThermometerSun className="w-4 h-4" />}
                                            </div>
                                            <div className="ml-1">
                                                {getPotentialCustomerDetails.data?.hotWarmCold || "Hot/Warm/Cold: -"}
                                            </div>
                                        </div>
                                        <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setHotWarmColdEditMode(true)}>
                                            Edit
                                        </div>
                                    </div>
                            }
                            <div className="flex flex-row items-center space-x-2">
                                <Bell className="w-4 h-4" />
                                <div>
                                    {getPotentialCustomerDetails.data?.preferredCommunicationMedium ? getPotentialCustomerDetails.data?.preferredCommunicationMedium + " is the preferred communication" : "Preferred Communication: -"}
                                </div>
                            </div>

                            <div>
                                {kidsEditMode ?
                                    <div className="flex flex-row items-center space-x-2">
                                        <Input
                                            type="number"
                                            value={kids}
                                            onChange={(e) => setKids(parseInt(e.target.value))}
                                        />
                                        <div
                                            className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                            onClick={async () => {
                                                await updateKids.mutateAsync({
                                                    email: email as string,
                                                    kids: kids,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setKidsEditMode(false)
                                            }}
                                        >
                                            Done
                                        </div>
                                    </div> :
                                    <div className="flex flex-row items-center space-x-2">
                                        <h1>
                                            {getPotentialCustomerDetails.data?.kids || "-"} kids
                                        </h1>
                                        <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setKidsEditMode(true)}>
                                            Edit
                                        </div>
                                    </div>
                                }
                            </div>
                            <div>
                                {
                                    relationshipStatusEditMode ?
                                        <div>
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

                                            <div
                                                className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                onClick={async () => {
                                                    await updateRelationshipStatus.mutateAsync({
                                                        email: email as string,
                                                        relationshipStatus: relationshipStatus,
                                                    })
                                                    await getPotentialCustomerDetails.refetch();
                                                    setRelationshipStatusEditMode(false)
                                                }}
                                            >
                                                Done
                                            </div>
                                        </div>
                                        :
                                        <div className="flex flex-row items-center space-x-2">
                                            <h1>
                                                {getPotentialCustomerDetails.data?.relationshipStatus || "Relationship Status: -"}
                                            </h1>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setRelationshipStatusEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    petsEditMode ?
                                        <div>
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
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updatePets.mutateAsync({
                                                            email: email as string,
                                                            hasPets: hasPets,
                                                            petTypes: hasPets ? petTypes : [],
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setPetsEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <h1>
                                                {getPotentialCustomerDetails.data?.hasPets === undefined || getPotentialCustomerDetails.data?.hasPets === null ? "Pets: -" : getPotentialCustomerDetails.data?.hasPets ? "Has pets" : "No pets"}
                                            </h1>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setPetsEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {personalityTypeEditMode ?
                                    <div className="flex flex-row items-center space-x-2">
                                        <div>
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
                                                        value={otherPersonality}
                                                        onChange={(e) => {
                                                            setOtherPersonality(e.target.value);
                                                        }}
                                                    />
                                                )
                                            }
                                        </div>
                                        <div
                                            className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                            onClick={async () => {
                                                await updatePersonalityType.mutateAsync({
                                                    email: email as string,
                                                    personalityType: personalityType === "Other" ? otherPersonality : personalityType,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setPersonalityTypeEditMode(false)
                                            }}
                                        >
                                            Done
                                        </div>
                                    </div>
                                    :
                                    <div className="flex flex-row items-center space-x-2">
                                        <h1>
                                            {getPotentialCustomerDetails.data?.personalityType || "-"} personality type
                                        </h1>
                                        <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setPersonalityTypeEditMode(true)}>
                                            Edit
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    </div>
                    {/* <div className="space-y-4">
                        <div className="flex flex-row items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <h1>
                                {
                                    registerData?.ipAddress?.ipInfo?.city && registerData?.ipAddress?.ipInfo?.regionName && registerData?.ipAddress?.ipInfo?.country &&
                                    (registerData?.ipAddress?.ipInfo?.city + ", " + registerData.ipAddress?.ipInfo?.regionName + ", " + registerData?.ipAddress?.ipInfo?.country) || "-"
                                }
                            </h1>
                        </div>
                        <h1>
                            Ad Source: {formatDisplayText(registerData?.medium, registerData?.content) || "-"}
                        </h1>
                        <div>
                            Sign Up Date: {
                                registerData?.createdAt ? new Date(
                                    registerData?.createdAt * 1000
                                ).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "-"
                            }
                        </div>
                        <div>
                            Buying Timeline: {formatBuyingTime(registerData?.buyingTimelinedec2023) || "-"}
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <div>
                                Locations of Interest:
                            </div>
                            <div className="flex flex-row items-center space-x-2">
                                {typeof registerData?.locationsOfInterest === "object" &&
                                    registerData?.locationsOfInterest?.map((location: string, index: number) => (
                                        <Badge key={index}>{location}</Badge>
                                    ))}
                                {typeof registerData?.locationsOfInterest === "string" &&
                                    <Badge>{registerData?.locationsOfInterest}</Badge>}
                                {registerData?.city && <Badge>{registerData.city}</Badge>}
                            </div>
                        </div>
                    </div> */}
                    <div className="w-[40%]">
                        <Card className="">
                            <CardHeader className="select-none">
                                <CardTitle>Waitlist Details</CardTitle>
                                <CardDescription>
                                    {`Details about the potential customer's waitlist details.`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RegisterDetails registerDetails={registerDetails} />
                            </CardContent>
                        </Card>
                        <Card className="mt-2">
                            <CardHeader className="select-none">
                                <CardTitle>Bio</CardTitle>
                                <CardDescription>
                                    {`Details about the potential customer's bio.`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="max-h-48 overflow-y-scroll">
                                <div>
                                    {
                                        bioEditMode ?
                                            <div>
                                                <Textarea
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                />
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateBio.mutateAsync({
                                                            email: email as string,
                                                            bio: bio,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setBioEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div> :
                                            <div>
                                                <ReactMarkdown>
                                                    {getPotentialCustomerDetails.data?.bio || "-"}
                                                </ReactMarkdown>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setBioEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Buyer Profile</AccordionTrigger>
                        <AccordionContent>
                            <div>
                                {
                                    firstTimeBuyerEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={firstTimeBuyer || false}
                                                        onCheckedChange={(checked) => setFirstTimeBuyer(!!checked)}
                                                    />
                                                    <h1>First Time Buyer</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateFirstTimeBuyer.mutateAsync({
                                                            email: email as string,
                                                            firstTimeBuyer: firstTimeBuyer,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setFirstTimeBuyerEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                First Time Buyer: {getPotentialCustomerDetails.data?.firstTimeBuyer === null || getPotentialCustomerDetails.data?.firstTimeBuyer === undefined ? "-" : getPotentialCustomerDetails.data?.firstTimeBuyer ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setFirstTimeBuyerEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    cashBuyerEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={cashBuyer || false}
                                                        onCheckedChange={(checked) => setCashBuyer(!!checked)}
                                                    />
                                                    <h1>Cash Buyer</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateCashBuyer.mutateAsync({
                                                            email: email as string,
                                                            cashBuyer: cashBuyer,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setCashBuyerEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Cash Buyer: {getPotentialCustomerDetails.data?.cashBuyer === null || getPotentialCustomerDetails.data?.cashBuyer === undefined ? "-" : getPotentialCustomerDetails.data?.cashBuyer ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setCashBuyerEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    brokerEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={broker || false}
                                                        onCheckedChange={(checked) => setBroker(!!checked)}
                                                    />
                                                    <h1>Broker</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateBroker.mutateAsync({
                                                            email: email as string,
                                                            broker: broker,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setBrokerEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Broker: {getPotentialCustomerDetails.data?.broker === null || getPotentialCustomerDetails.data?.broker === undefined ? "-" : getPotentialCustomerDetails.data?.broker ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setBrokerEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    attorneyEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={attorney || false}
                                                        onCheckedChange={(checked) => setAttorney(!!checked)}
                                                    />
                                                    <h1>Attorney</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateAttorney.mutateAsync({
                                                            email: email as string,
                                                            attorney: attorney,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setAttorneyEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Attorney: {getPotentialCustomerDetails.data?.attorney === null || getPotentialCustomerDetails.data?.attorney === undefined ? "-" : getPotentialCustomerDetails.data?.attorney ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setAttorneyEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    whosPayingEditMode ?
                                        <div>
                                            <h1>Who is paying:</h1>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div>
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
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateWhosPaying.mutateAsync({
                                                            email: email as string,
                                                            whosPaying: whosPaying === "Other" ? otherPayer : whosPaying,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setWhosPayingEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> : <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Who is Paying: {whosPaying ? whosPaying : "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setWhosPayingEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    mortgagePreQualifiedEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={mortgagePreQualified || false}
                                                        onCheckedChange={(checked) => setMortgagePreQualified(!!checked)}
                                                    />
                                                    <h1>Mortgage Pre-Qualified</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateMortgagePreQualified.mutateAsync({
                                                            email: email as string,
                                                            mortgagePreQualified: mortgagePreQualified,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setMortgagePreQualifiedEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Mortgage Pre-Qualified: {getPotentialCustomerDetails.data?.mortgagePreQualified === null || getPotentialCustomerDetails.data?.mortgagePreQualified === undefined ? "-" : getPotentialCustomerDetails.data?.mortgagePreQualified ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setMortgagePreQualifiedEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {homePurchaseTypeEditMode ?
                                    <div className="flex flex-row items-center space-x-2">
                                        <div>
                                            <Select value={homePurchaseType || undefined} onValueChange={setHomePurchaseType}>
                                                <SelectTrigger className="max-w-max mt-1">
                                                    <SelectValue placeholder="Select a home purchase type" />
                                                </SelectTrigger>
                                                <SelectContent className="max-w-max">
                                                    {["Live In", "Investment"].map((homePurchaseTypeItem) => (
                                                        <SelectItem key={homePurchaseTypeItem} value={homePurchaseTypeItem} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                                            {homePurchaseTypeItem}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <div
                                                className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                onClick={async () => {
                                                    await updateHomePurchaseType.mutateAsync({
                                                        email: email as string,
                                                        homePurchaseType: homePurchaseType,
                                                    })
                                                    await getPotentialCustomerDetails.refetch();
                                                    setHomePurchaseTypeEditMode(false)
                                                }}
                                            >
                                                Done
                                            </div>
                                        </div>
                                    </div> : <div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <h1>
                                                Home Purchase Type: {getPotentialCustomerDetails.data?.homePurchaseType || "-"}
                                            </h1>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setHomePurchaseTypeEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                    </div>}
                            </div>
                            <div>
                                {
                                    wantsHelpFinancingEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={wantsHelpFinancing || false}
                                                        onCheckedChange={(checked) => setWantsHelpFinancing(!!checked)}
                                                    />
                                                    <h1>Wants Help Financing</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateWantsHelpFinancing.mutateAsync({
                                                            email: email as string,
                                                            wantsHelpFinancing: wantsHelpFinancing,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setWantsHelpFinancingEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Wants Help Financing: {getPotentialCustomerDetails.data?.wantsHelpFinancing === null || getPotentialCustomerDetails.data?.wantsHelpFinancing === undefined ? "-" : getPotentialCustomerDetails.data?.wantsHelpFinancing ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setWantsHelpFinancingEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    necessityOrAmenityEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div>
                                                    <Select value={necessityOrAmenity || undefined} onValueChange={setNecessityOrAmenity}>
                                                        <SelectTrigger className="w-full mt-1">
                                                            <SelectValue placeholder="Select a necessity or amenity" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {["Necessity", "Amenity"].map((necessityOrAmenityItem) => (
                                                                <SelectItem key={necessityOrAmenityItem} value={necessityOrAmenityItem} className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer select-none">
                                                                    {necessityOrAmenityItem}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <div
                                                        className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                        onClick={async () => {
                                                            await updateNecessityOrAmenity.mutateAsync({
                                                                email: email as string,
                                                                necessityOrAmenity: necessityOrAmenity,
                                                            })
                                                            await getPotentialCustomerDetails.refetch();
                                                            setNecessityOrAmenityEditMode(false)
                                                        }}
                                                    >
                                                        Done
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Necessity or Amenity: {getPotentialCustomerDetails.data?.necessityOrAmenity || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setNecessityOrAmenityEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    funnelTypeEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div>
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
                                                </div>
                                                {
                                                    funnelType === "Real Buyer" && (
                                                        <div>
                                                            <Label>Real Buyer Timeline</Label>
                                                            <Select value={realBuyerTimeline || undefined} onValueChange={
                                                                async (value) => {
                                                                    if (value) {
                                                                        await updateRealBuyerTimeline.mutateAsync({
                                                                            email: email as string,
                                                                            realBuyerTimeline: value,
                                                                        })
                                                                        await getPotentialCustomerDetails.refetch();
                                                                    }
                                                                }
                                                            }>
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
                                                <div>
                                                    <div
                                                        className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                        onClick={async () => {
                                                            await updateFunnelType.mutateAsync({
                                                                email: email as string,
                                                                funnelType: funnelType,
                                                            })
                                                            await getPotentialCustomerDetails.refetch();
                                                            setFunnelTypeEditMode(false)
                                                        }}
                                                    >
                                                        Done
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Funnel Type: {getPotentialCustomerDetails.data?.funnelType || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setFunnelTypeEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Customer Preferences</AccordionTrigger>
                        <AccordionContent>
                            <div>
                                {
                                    communityScoreEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <h1>Community Score</h1>
                                                    <Input
                                                        type="number"
                                                        value={communityScore}
                                                        onChange={(e) => setCommunityScore(parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateCommunityScore.mutateAsync({
                                                            email: email as string,
                                                            communityScore: communityScore,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setCommunityScoreEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Community Score: {getPotentialCustomerDetails.data?.communityScore || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setCommunityScoreEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {relevanceEditMode ?
                                    <div>
                                        <div>
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
                                            <div
                                                className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                onClick={async () => {
                                                    await updateRelevance.mutateAsync({
                                                        email: email as string,
                                                        relevance: relevance,
                                                    })
                                                    await getPotentialCustomerDetails.refetch();
                                                    setRelevanceEditMode(false)
                                                }}
                                            >
                                                Done
                                            </div>
                                        </div>
                                    </div> :
                                    <div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <h1>
                                                Relevance: {getPotentialCustomerDetails.data?.relevance?.join(", ") || "-"}
                                            </h1>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setRelevanceEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div>
                                {
                                    knowOMAEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={knowOMA || false}
                                                        onCheckedChange={(checked) => setKnowOMA(!!checked)}
                                                    />
                                                    <h1>Know OMA</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateKnowOMA.mutateAsync({
                                                            email: email as string,
                                                            knowOMA: knowOMA,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setKnowOMAEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Know OMA: {getPotentialCustomerDetails.data?.knowOMA === null || getPotentialCustomerDetails.data?.knowOMA === undefined ? "-" : getPotentialCustomerDetails.data?.knowOMA ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setKnowOMAEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    interestInHomeSwappingEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={interestInHomeSwapping || false}
                                                        onCheckedChange={(checked) => setInterestInHomeSwapping(!!checked)}
                                                    />
                                                    <h1>Interest in Home Swapping</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateInterestInHomeSwapping.mutateAsync({
                                                            email: email as string,
                                                            interestInHomeSwapping: interestInHomeSwapping,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setInterestInHomeSwappingEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Interest in Home Swapping: {getPotentialCustomerDetails.data?.interestInHomeSwapping === null || getPotentialCustomerDetails.data?.interestInHomeSwapping === undefined ? "-" : getPotentialCustomerDetails.data?.interestInHomeSwapping ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setInterestInHomeSwappingEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    interestInFurnitureEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={interestInFurniture || false}
                                                        onCheckedChange={(checked) => setInterestInFurniture(!!checked)}
                                                    />
                                                    <h1>Interest in Furniture</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateInterestInFurniture.mutateAsync({
                                                            email: email as string,
                                                            interestInFurniture: interestInFurniture,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setInterestInFurnitureEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Interest in Furniture: {getPotentialCustomerDetails.data?.interestInFurniture === null || getPotentialCustomerDetails.data?.interestInFurniture === undefined ? "-" : getPotentialCustomerDetails.data?.interestInFurniture ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setInterestInFurnitureEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    homeTypeEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <Select value={homeType || undefined} onValueChange={setHomeType}>
                                                <SelectTrigger className="max-w-max mt-1">
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
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateHomeType.mutateAsync({
                                                    email: email as string,
                                                    homeType: homeType,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setHomeTypeEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Home Type: {getPotentialCustomerDetails.data?.homeType || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setHomeTypeEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    lookingForUnitTypeEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <Select value={lookingForUnitType || undefined} onValueChange={setLookingForUnitType}>
                                                <SelectTrigger className="max-w-max mt-1">
                                                    <SelectValue placeholder="Select a unit type" className="max-w-max" />
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
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateLookingForUnitType.mutateAsync({
                                                    email: email as string,
                                                    lookingForUnitType: lookingForUnitType,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setLookingForUnitTypeEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Looking For Unit Type: {getPotentialCustomerDetails.data?.lookingForUnitType || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setLookingForUnitTypeEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    maxBudgetEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div className="">
                                                {sliderValueMax ? <div className="text-muted-foreground text-sm">
                                                    {sliderValueMax[0]?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
                                                </div> : <div className="text-muted-foreground text-sm">
                                                    Unknown
                                                </div>}
                                                <div>
                                                    <Slider
                                                        value={sliderValueMax || [50_000]}
                                                        onValueChange={(value) => {
                                                            setSliderValueMax(value);
                                                        }}
                                                        min={500_000}
                                                        max={2_000_000}
                                                        step={50_000}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateMaxBudget.mutateAsync({
                                                    email: email as string,
                                                    maxBudget: (sliderValueMax && sliderValueMax.length > 0) ? sliderValueMax[0] : null,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setMaxBudgetEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Max Budget: {sliderValueMax ? <span>
                                                    {sliderValueMax[0]?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD
                                                </span> :
                                                    <span className="text-muted-foreground text-sm">
                                                        Unknown
                                                    </span>
                                                }
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setMaxBudgetEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    buyingTimelineEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                {
                                                    ["Immediate", "1-3 months", "3-6 months", "6-12 months", "12 - 18 months", "18 - 24 months", "24 months+"]
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
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateBuyingTimeline.mutateAsync({
                                                            email: email as string,
                                                            buyingTimeline: buyingTimeline,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setBuyingTimelineEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Buying Timeline: {getPotentialCustomerDetails.data?.buyingTimeline?.join(", ") || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setBuyingTimelineEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    travelForWorkEditMode ?
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <div className="flex flex-row items-center space-x-1">
                                                    <Checkbox
                                                        checked={travelForWork || false}
                                                        onCheckedChange={(checked) => setTravelForWork(!!checked)}
                                                    />
                                                    <h1>Travel For Work</h1>
                                                </div>
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateTravelForWork.mutateAsync({
                                                            email: email as string,
                                                            travelForWork: travelForWork,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setTravelForWorkEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Travel For Work: {getPotentialCustomerDetails.data?.travelForWork === null || getPotentialCustomerDetails.data?.travelForWork === undefined ? "-" : getPotentialCustomerDetails.data?.travelForWork ? "Yes" : "No"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setTravelForWorkEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    travelFrequencyEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={travelFrequency}
                                                    onChange={(e) => setTravelFrequency(e.target.value)}
                                                    placeholder="Travel Frequency"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateTravelFrequency.mutateAsync({
                                                    email: email as string,
                                                    travelFrequency: travelFrequency,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setTravelFrequencyEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Travel Frequency: {getPotentialCustomerDetails.data?.travelFrequency || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setTravelFrequencyEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    familyAbroadEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={familyAbroad}
                                                    onChange={(e) => setFamilyAbroad(e.target.value)}
                                                    placeholder="Family Abroad"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateFamilyAbroad.mutateAsync({
                                                    email: email as string,
                                                    familyAbroad: familyAbroad,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setFamilyAbroadEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Family Abroad: {getPotentialCustomerDetails.data?.familyAbroad || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setFamilyAbroadEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    frequentedCitiesEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={frequentedCities}
                                                    onChange={(e) => setFrequentedCities(e.target.value)}
                                                    placeholder="Frequented Cities"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateFrequentedCities.mutateAsync({
                                                    email: email as string,
                                                    frequentedCities: frequentedCities,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setFrequentedCitiesEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Frequented Cities: {getPotentialCustomerDetails.data?.frequentedCities || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setFrequentedCitiesEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    desiredCitiesEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={desiredCities}
                                                    onChange={(e) => setDesiredCities(e.target.value)}
                                                    placeholder="Desired Cities"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateDesiredCities.mutateAsync({
                                                    email: email as string,
                                                    desiredCities: desiredCities,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setDesiredCitiesEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Desired Cities: {getPotentialCustomerDetails.data?.desiredCities || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setDesiredCitiesEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    otherCitiesEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={otherCities}
                                                    onChange={(e) => setOtherCities(e.target.value)}
                                                    placeholder="Other Cities"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateOtherCities.mutateAsync({
                                                    email: email as string,
                                                    otherCities: otherCities,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setOtherCitiesEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Other Cities: {getPotentialCustomerDetails.data?.otherCities || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setOtherCitiesEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    otherNeighborhoodsEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={otherNeighborhoods}
                                                    onChange={(e) => setOtherNeighborhoods(e.target.value)}
                                                    placeholder="Other Neighborhoods"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateOtherNeighborhoods.mutateAsync({
                                                    email: email as string,
                                                    otherNeighborhoods: otherNeighborhoods,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setOtherNeighborhoodsEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Other Neighborhoods: {getPotentialCustomerDetails.data?.otherNeighborhoods || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setOtherNeighborhoodsEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    relevantPropertyEditMode ?
                                        <div>
                                            <div>
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
                                                <div
                                                    className="text-blue-500 hover:text-blue-400 cursor-pointer"
                                                    onClick={async () => {
                                                        await updateRelevantProperty.mutateAsync({
                                                            email: email as string,
                                                            relevantProperty: relevantProperty,
                                                        })
                                                        await getPotentialCustomerDetails.refetch();
                                                        setRelevantPropertyEditMode(false)
                                                    }}
                                                >
                                                    Done
                                                </div>
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Relevant Property: {getPotentialCustomerDetails.data?.relevantProperty?.join(", ") || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setRelevantPropertyEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    currentLivingSituationEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={currentLivingSituation}
                                                    onChange={(e) => setCurrentLivingSituation(e.target.value)}
                                                    placeholder="Current Living Situation"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateCurrentLivingSituation.mutateAsync({
                                                    email: email as string,
                                                    currentLivingSituation: currentLivingSituation,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setCurrentLivingSituationEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Current Living Situation: {getPotentialCustomerDetails.data?.currentLivingSituation || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setCurrentLivingSituationEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    currentlyLivingInEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={currentlyLivingIn}
                                                    onChange={(e) => setCurrentlyLivingIn(e.target.value)}
                                                    placeholder="Currently Living In"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateCurrentlyLivingIn.mutateAsync({
                                                    email: email as string,
                                                    currentlyLivingIn: currentlyLivingIn,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setCurrentlyLivingInEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Currently Living In: {getPotentialCustomerDetails.data?.currentlyLivingIn || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setCurrentlyLivingInEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    lookingForCityEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={lookingForCity}
                                                    onChange={(e) => setLookingForCity(e.target.value)}
                                                    placeholder="Looking For City"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateLookingForCity.mutateAsync({
                                                    email: email as string,
                                                    lookingForCity: lookingForCity,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setLookingForCityEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Looking For City: {getPotentialCustomerDetails.data?.lookingForCity || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setLookingForCityEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    lookingForNeighborhoodEditMode ?
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                <Input
                                                    type="text"
                                                    value={lookingForNeighborhood}
                                                    onChange={(e) => setLookingForNeighborhood(e.target.value)}
                                                    placeholder="Looking For Neighborhood"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateLookingForNeighborhood.mutateAsync({
                                                    email: email as string,
                                                    lookingForNeighborhood: lookingForNeighborhood,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setLookingForNeighborhoodEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>
                                                Looking For Neighborhood: {getPotentialCustomerDetails.data?.lookingForNeighborhood || "-"}
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setLookingForNeighborhoodEditMode(true)}>
                                                Edit
                                            </div>
                                        </div>
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Notes</AccordionTrigger>
                        <AccordionContent>
                            <div>
                                {
                                    personalNotesEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={personalNotes}
                                                    onChange={(e) => setPersonalNotes(e.target.value)}
                                                    placeholder="Personal Notes"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updatePersonalNotes.mutateAsync({
                                                    email: email as string,
                                                    personalNotes: personalNotes,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setPersonalNotesEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Personal Notes: {getPotentialCustomerDetails.data?.personalNotes || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setPersonalNotesEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    communityFitEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={communityFit}
                                                    onChange={(e) => setCommunityFit(e.target.value)}
                                                    placeholder="Community Fit"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateCommunityFit.mutateAsync({
                                                    email: email as string,
                                                    communityFit: communityFit,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setCommunityFitEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Community Fit: {getPotentialCustomerDetails.data?.communityFit || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setCommunityFitEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    eyeCatchingNoteEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={eyeCatchingNote}
                                                    onChange={(e) => setEyeCatchingNote(e.target.value)}
                                                    placeholder="Eye Catching Note"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateEyeCatchingNote.mutateAsync({
                                                    email: email as string,
                                                    eyeCatchingNote: eyeCatchingNote,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setEyeCatchingNoteEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Eye Catching Note: {getPotentialCustomerDetails.data?.eyeCatchingNote || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setEyeCatchingNoteEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    whatSparkInterestEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={whatSparkInterest}
                                                    onChange={(e) => setWhatSparkInterest(e.target.value)}
                                                    placeholder="What Spark Interest"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateWhatSparkInterest.mutateAsync({
                                                    email: email as string,
                                                    whatSparkInterest: whatSparkInterest,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setWhatSparkInterestEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    What Spark Interest: {getPotentialCustomerDetails.data?.whatSparkInterest || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setWhatSparkInterestEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    whatTheyLikeAboutApartmentsEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={whatTheyLikeAboutApartments}
                                                    onChange={(e) => setWhatTheyLikeAboutApartments(e.target.value)}
                                                    placeholder="What They Like About Apartments"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateWhatTheyLikeAboutApartments.mutateAsync({
                                                    email: email as string,
                                                    whatTheyLikeAboutApartments: whatTheyLikeAboutApartments,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setWhatTheyLikeAboutApartmentsEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    What They Like About Apartments: {getPotentialCustomerDetails.data?.whatTheyLikeAboutApartments || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setWhatTheyLikeAboutApartmentsEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    whatTheyDontLikeAboutApartmentsEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={whatTheyDontLikeAboutApartments}
                                                    onChange={(e) => setWhatTheyDontLikeAboutApartments(e.target.value)}
                                                    placeholder="What They Don't Like About Apartments"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateWhatTheyDontLikeAboutApartments.mutateAsync({
                                                    email: email as string,
                                                    whatTheyDontLikeAboutApartments: whatTheyDontLikeAboutApartments,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setWhatTheyDontLikeAboutApartmentsEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    {"What They Don't Like About Apartments"}: {getPotentialCustomerDetails.data?.whatTheyDontLikeAboutApartments || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setWhatTheyDontLikeAboutApartmentsEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    additionalNotesEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={additionalNotes}
                                                    onChange={(e) => setAdditionalNotes(e.target.value)}
                                                    placeholder="Additional Notes"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateAdditionalNotes.mutateAsync({
                                                    email: email as string,
                                                    additionalNotes: additionalNotes,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setAdditionalNotesEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Additional Notes: {getPotentialCustomerDetails.data?.additionalNotes || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setAdditionalNotesEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    OMANotesEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={OMANotes}
                                                    onChange={(e) => setOMANotes(e.target.value)}
                                                    placeholder="OMA Notes"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateOMANotes.mutateAsync({
                                                    email: email as string,
                                                    OMANotes: OMANotes,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setOMANotesEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    OMA Notes: {getPotentialCustomerDetails.data?.OMANotes || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setOMANotesEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    howTheyFoundHome0001EditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={howTheyFoundHome0001}
                                                    onChange={(e) => setHowTheyFoundHome0001(e.target.value)}
                                                    placeholder="How They Found Home0001"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateHowTheyFoundHome0001.mutateAsync({
                                                    email: email as string,
                                                    howTheyFoundHome0001: howTheyFoundHome0001,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setHowTheyFoundHome0001EditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    How They Found Home0001: {getPotentialCustomerDetails.data?.howTheyFoundHome0001 || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setHowTheyFoundHome0001EditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    interestInFurnitureNotesEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={interestInFurnitureNotes}
                                                    onChange={(e) => setInterestInFurnitureNotes(e.target.value)}
                                                    placeholder="Interest In Furniture Notes"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateInterestInFurnitureNotes.mutateAsync({
                                                    email: email as string,
                                                    interestInFurnitureNotes: interestInFurnitureNotes,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setInterestInFurnitureNotesEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Interest In Furniture Notes: {getPotentialCustomerDetails.data?.interestInFurnitureNotes || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setInterestInFurnitureNotesEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div>
                                {
                                    interestInHomeSwappingNotesEditMode ?
                                        <div>
                                            <div>
                                                <Input
                                                    value={interestInHomeSwappingNotes}
                                                    onChange={(e) => setInterestInHomeSwappingNotes(e.target.value)}
                                                    placeholder="Interest In Home Swapping Notes"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={async () => {
                                                await updateInterestInHomeSwappingNotes.mutateAsync({
                                                    email: email as string,
                                                    interestInHomeSwappingNotes: interestInHomeSwappingNotes,
                                                })
                                                await getPotentialCustomerDetails.refetch();
                                                setInterestInHomeSwappingNotesEditMode(false)
                                            }}>
                                                Done
                                            </div>
                                        </div> :
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <h1>
                                                    Interest In Home Swapping Notes: {getPotentialCustomerDetails.data?.interestInHomeSwappingNotes || "-"}
                                                </h1>
                                                <div className="text-blue-500 hover:text-blue-400 cursor-pointer" onClick={() => setInterestInHomeSwappingNotesEditMode(true)}>
                                                    Edit
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="right-element">
                        <CardHeader>
                            <CardTitle>Next Steps Chain</CardTitle>
                            <CardDescription>
                                History of Next steps set by Home0001.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* TODO: make this ui much better, use untitledui for inspiration (maybe just make this a third card with profile notes and contact details) */}
                            <div className="flex flex-row items-center space-x-2">
                                {(getPotentialCustomerDetails.data?.nextStepsDropdownValue || []).length > 0 ? (
                                    <div>
                                        {getPotentialCustomerDetails.data?.nextStepsDropdownValue
                                            .sort((a: any, b: any) => b.timestamp - a.timestamp)
                                            .map((step: any, index: number) => (
                                                <div key={index} className={cn("flex flex-row items-center space-x-2", step?.completed && "line-through opacity-50")}>
                                                    <div className="flex flex-row items-center space-x-1">
                                                        {step.value.startsWith("action:") ? <CircleAlert className="w-4 h-4 text-red-500" /> : <Hourglass className="w-4 h-4 text-blue-300" />}
                                                        {/* @ts-expect-error TODO: Fix this */}
                                                        <h1>{nextStepsMapping[step.value] || step.value.split(":").slice(1).join(":")
                                                        } -</h1>
                                                        <h1>{
                                                            moment.utc(moment.unix(step.timestamp)).format("MMM DD, YYYY")
                                                        }</h1>
                                                    </div>
                                                    <DeleteNextStepChainLink email={email as string} index={index} />
                                                </div>
                                            ))}
                                    </div>
                                ) : <div>-</div>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 space-y-6">
                    {bookings.data && bookings.data
                        .slice(0, maxBookingsToShow)
                        .map((booking: any, index: number) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="flex flex-row items-center justify-between">
                                        <div className="flex flex-row items-center space-x-2">
                                            <div>{booking?.type === "Property Tour" ? <School className="w-4 h-4" /> : <Phone className="w-4 h-4" />}</div>
                                            <div>{booking?.type === "Property Tour" ? "Property Tour" : "Phone Call"} Appointment Details</div>
                                        </div>
                                        {(booking?.rescheduleCount || 0) > 1 && <Badge variant="default" className="select-none hover:bg-black dark:hover:bg-white">
                                            rescheduled
                                        </Badge>}
                                    </CardTitle>
                                    <CardDescription>
                                        Appointment details for {
                                            getPotentialCustomerDetails.data ? (getPotentialCustomerDetails.data?.firstName + " " + getPotentialCustomerDetails.data?.lastName) : (registerDetails.data?.data?.firstName + " " + registerDetails.data?.data?.lastName)
                                        }
                                    </CardDescription>
                                    {!booking?.startTimestamp && !booking?.endTimestamp && <Alert variant="destructive" className="select-none">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Action Required</AlertTitle>
                                        <AlertDescription>
                                            Pending Booking. Add a date to this booking in the <span className="underline cursor-pointer" onClick={
                                                () => router.push(`/bookings`)
                                            }>bookings</span> page
                                        </AlertDescription>
                                    </Alert>}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex flex-row items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <div>{formatTimestamp(booking?.startTimestamp, true, timezone) || "-"}</div>
                                        </div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <Timer className="w-4 h-4" />
                                            <div className="font-semibold">Duration</div>
                                            <div>{
                                                booking && booking?.startTimestamp && booking?.endTimestamp ? (booking?.endTimestamp - booking?.startTimestamp) / (60 * 1000) + " minutes" : "-"
                                            }</div>
                                        </div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <MapPin className="w-4 h-4" />
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        {booking ? <div className="max-w-max truncate text-blue-500 hover:text-blue-400 cursor-pointer" onClick={
                                                            () => {
                                                                window.open(
                                                                    booking?.type === "Property Tour" ? "https://streeteasy.com/building/home0001-48-allen" : ZOOM_URL, "_blank")
                                                            }
                                                        }>{
                                                                booking?.type === "Property Tour" ? "https://streeteasy.com/building/home0001-48-allen" : ZOOM_URL
                                                            }</div> : <div>-</div>}
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {booking?.type === "Property Tour" ? "Click to view the location" : "Click to join the Zoom call"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <Contact className="w-4 h-4" />
                                                <h1 className="font-semibold">Interviewer</h1>
                                                <h1>{booking?.interviewer || "-"}</h1>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex flex-row items-center space-x-2">
                                                <Contact className="w-4 h-4" />
                                                <h1 className="font-semibold">Status</h1>
                                                <Badge>{booking?.status || "scheduled"}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <FileQuestion className="w-4 h-4" />
                                            <h1 className="font-semibold">Customer Questions</h1>
                                        </div>
                                        <div className="ml-6">
                                            <p className="whitespace-pre-wrap break-words">
                                                {booking?.notes || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <NotepadText className="w-4 h-4" />
                                            <h1 className="font-semibold">Legacy Meeting Notes</h1>
                                        </div>
                                        <div className="ml-6">
                                            <p className="whitespace-pre-wrap break-words">
                                                {booking?.additionalNotes || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <NotepadText className="w-4 h-4" />
                                            <h1 className="font-semibold">Meeting Notes</h1>
                                        </div>
                                        {/* TODO: remove hover on badges */}
                                        {/* TODO: make badge have an option to have no hover i.e. hover={false} which if true, will have cursor-pointer and such and not if false. need to reuse everywhere because not consistent atm */}
                                        {booking?.additionalDetails ? <div className="ml-6">
                                            <div>
                                                Meeting Notes: {booking?.additionalDetails?.meetingNotes}
                                            </div>
                                            <div>
                                                what apartments are their favorites: {booking?.additionalDetails?.whatApartmentsAreTheirFavorites}
                                            </div>
                                            <div>
                                                what apartments did they see: {booking?.additionalDetails?.whatApartmentsDidTheySee}
                                            </div>
                                        </div> : <div className="ml-6">-</div>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    {bookings.data && bookings.data.length > maxBookingsToShow &&
                        <div className="text-blue-500 hover:text-blue-400 cursor-pointer text-center" onClick={() => setMaxBookingsToShow(maxBookingsToShow + 2)}>
                            Show more
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

interface RegisterDetailsProps {
    registerDetails: any;
}

const formatDisplayText = (...args: string[]) => {
    let displayText = "";

    args.forEach((arg, index) => {
        if (arg) {
            displayText += arg;
            if (index !== args.length - 1) {
                displayText += ", ";
            }
        }
    });

    if (displayText.endsWith(", ")) {
        displayText = displayText.slice(0, -2);
    }

    return displayText;
};

const formatBuyingTime = (buyingTime: string) => {
    if (!buyingTime) {
        return null;
    }

    switch (buyingTime) {
        case "1to3mos":
            return "1 to 3 months";
        case "notsure":
            return "Not Sure";
        case "3to6mos":
            return "3 to 6 months";
        case "6to12mos":
            return "6 to 12 months";
        default:
            return buyingTime;
    }
}

const RegisterDetails = (props: RegisterDetailsProps) => {
    const { registerDetails } = props;

    if (registerDetails.isLoading) {
        return (
            <Skeleton className="w-full h-40" />
        );
    }

    if (!registerDetails.data || registerDetails.data?.length === 0) {
        return (
            <div className="">
                -
            </div>
        );
    }

    const registerData = registerDetails.data.data;

    return (
        <div className="max-h-96 overflow-y-scroll">
            <div className="space-y-2">
                {/* <div>
                    First Name: {registerData.firstName || "-"}
                </div>

                <div>
                    Last Name: {registerData.lastName || "-"}
                </div> */}

                {/* <div>
                    City: {registerData.city || "-"}
                </div> */}

                {/* <div>
                    Bedroom Preference: {registerData.bedroomPreference || "-"}
                </div> */}

                {/* <div>
                    IP Address: {registerData.ipAddress.ip || "-"}
                </div>

                <div>
                    ZIP: {registerData.ipAddress.ipInfo.zip || "-"}
                </div> */}

                {/* <div>
                    Country: {registerData.ipAddress.ipInfo.country || "-"}
                </div> */}

                <div className="flex flex-row items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <div>
                        {registerData?.ipAddress?.ipInfo?.city && registerData?.ipAddress?.ipInfo?.regionName && registerData?.ipAddress?.ipInfo?.country &&
                            (registerData?.ipAddress?.ipInfo?.city + ", " + registerData.ipAddress?.ipInfo?.regionName + ", " + registerData?.ipAddress?.ipInfo?.country) || "-"}
                    </div>
                </div>

                {/* <div>
                    Organization of IP Address: {registerData.ipAddress.ipInfo.org || "-"}
                </div> */}

                {/* <div>
                    Timezone: {registerData.ipAddress.ipInfo.timezone || "-"}
                </div> */}

                {/* <div>
                    Region Name: {registerData.ipAddress.ipInfo.regionName || "-"}
                </div> */}

                {/* <div>
                    ISP: {registerData.ipAddress.ipInfo.isp || "-"}
                </div>

                <div>
                    Longitude: {registerData.ipAddress.ipInfo.lon || "-"}
                </div>

                <div>
                    Latitude: {registerData.ipAddress.ipInfo.lat || "-"}
                </div> */}

                {/* <div>
                    AS: {registerData.ipAddress.ipInfo.as || "-"}
                </div> */}

                {/* <div>
                    Country Code: {registerData.ipAddress.ipInfo.countryCode || "-"}
                </div> */}

                {/* <div>
                    Region: {registerData.ipAddress.ipInfo.region || "-"}
                </div> */}

                {/* <div>
                    User Agent: {registerData.userAgent || "-"}
                </div> */}
                {/*
                <div>
                    Source: {registerData.source || "-"}
                </div> */}

                {/* <div>
                    Medium: {registerData.medium || "-"}
                </div>

                <div>
                    Content: {registerData.content || "-"}
                </div> */}

                <div>
                    Ad Source: {formatDisplayText(registerData?.medium, registerData?.content) || "-"}
                </div>

                {/* <div>
                    Routes: {registerData.routes || "-"}
                </div> */}

                <div>
                    Sign Up Date: {
                        registerData?.createdAt ? new Date(
                            registerData?.createdAt * 1000
                        ).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "-"
                    }
                </div>
                {/*
                <div>
                    HUTK: {registerData.hutk || "-"}
                </div> */}

                <div>
                    Buying Timeline: {formatBuyingTime(registerData?.buyingTimelinedec2023) || "-"}
                </div>

                {/* <div>
                    Else: {registerData.Else || "-"}
                </div> */}

                {/* <div>
                    Campaign: {registerData.campaign || "-"}
                </div> */}

                <div className="flex flex-row items-center space-x-2">
                    <div>
                        Locations of Interest:
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                        {typeof registerData?.locationsOfInterest === "object" &&
                            registerData?.locationsOfInterest?.map((location: string, index: number) => (
                                <Badge key={index}>{location}</Badge>
                            ))}
                        {typeof registerData?.locationsOfInterest === "string" &&
                            <Badge>{registerData?.locationsOfInterest}</Badge>}
                        {registerData?.city && <Badge>{registerData.city}</Badge>}
                    </div>
                </div>

                {/* <div>
                    Ad Set: {registerData.adSet || "-"}
                </div> */}

                <div>
                    {/* Page: {registerData.page || "-"} */}
                </div>

                {/* <div>
                    Email: {registerData.email || "-"}
                </div> */}

                {/* <div>
                    Full Query: {registerData.fullQuery || "-"}
                </div> */}
            </div>
        </div>
    );
};

export default BookingDetails;
