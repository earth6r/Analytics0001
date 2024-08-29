import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Cog, Home, LogOut, Menu, Package2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { api } from "@/utils/api";
import lodash from "lodash";
import Spinner from "./spinner";

const Header = () => {
  const router = useRouter();

  const { profilePictureUrl } = useUser();

  const [name, setName] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem("name"));
  }, []);

  const [globalSearchValue, setGlobalSearchValue] = useState("");
  const [globalSearchResults, setGlobalSearchResults] = useState<{
    type: string, value: {
      uid: string,
      firstName: string | null,
      lastName: string | null,
      email: string | null,
      imageUrl: string,
    }
  }[] | null>(null);

  const globalSearch = api.post.globalSearch.useMutation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchGlobalSearchResults = useCallback(
    lodash.debounce(async (value: string) => {
      if (value) {
        const response = await globalSearch.mutateAsync({ query: value });
        setGlobalSearchResults(response);
        setIsSearching(false);
      }
    }, 2000),
    []
  );

  return (
    <div>
      <header className="sticky top-0 flex h-16 select-none items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/stats"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Home0001</span>
          </Link>
          <Link
            href="/stats"
            className={cn(
              "transition-colors hover:text-foreground",
              router.pathname === "/stats"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/registers"
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              router.pathname === "/registers"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Waitlists
          </Link>
          {/* TODO: uncomment and fix mobile view + fully test everything */}
          {/* <Link
            href="/messages"
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              router.pathname === "/messages"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Messages
          </Link> */}
          {/* TODO: uncomment and fix mobile view + fully test everything */}
          <Link
            href="/customers"
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              router.pathname === "/customers"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Customers
          </Link>
          <Link
            href="/bookings"
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              router.pathname === "/bookings"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Bookings
          </Link>
          <Link
            href="/settings"
            className={cn(
              "transition-colors hover:text-foreground",
              router.pathname === "/settings"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Settings
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="/stats"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  router.pathname === "/stats"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/registers"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  router.pathname === "/registers"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                Waitlists
              </Link>
              {/* <Link
                href="/messages"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  router.pathname === "/messages"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                Messages
              </Link> */}
              <Link
                href="/customers"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  router.pathname === "/customers"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                Customers
              </Link>
              <Link
                href="/bookings"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  router.pathname === "/bookings"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                Bookings
              </Link>
              <Link
                href="/settings"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  router.pathname === "/settings"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                value={globalSearchValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setGlobalSearchValue(value);
                  setIsSearching(true);
                  fetchGlobalSearchResults(value);
                }}
              />
              {globalSearchValue && (
                <div className="z-[500] absolute border rounded-lg bg-white mt-1 p-1 space-y-4 w-full sm:w-[300px] md:w-[200px] lg:w-[300px]">
                  {globalSearchResults !== null && globalSearchResults.length > 0 && globalSearchResults.map((result) => (
                    <div
                      key={result.value.uid}
                      className="flex flex-row items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 hover:rounded-lg p-1"
                      onClick={async () => {
                        await router.push(`/booking-details?email=${result.value.email}`);
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={result.value.imageUrl ?? (result.value.firstName
                            ? `https://ui-avatars.com/api/?name=${result.value.firstName}+${result.value.lastName}`
                            : undefined)
                          }
                          alt={result.value.firstName ?? "@user"}
                        />
                        <AvatarFallback>{result.value.firstName?.charAt(0).toUpperCase()}{result.value.lastName?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <h1 className="text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap sm:max-w-[200px] md:max-w-[100px] lg:max-w-[200px]">
                        {result.value.firstName + " " + result.value.lastName}
                      </h1>
                    </div>
                  ))}
                  {globalSearchResults !== null && globalSearchResults.length === 0 && (
                    <div>
                      <h1 className="text-muted-foreground">No results found</h1>
                    </div>
                  )}
                  {isSearching && (
                    <div className="flex items-center justify-center">
                      <Spinner />
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      profilePictureUrl ?? (name
                        ? `https://ui-avatars.com/api/?name=${name}`
                        : undefined)
                    }
                    alt="@user"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await router.push("/stats");
                }}
                className="flex flex-row items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <h1>Home</h1>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await router.push("/settings");
                }}
                className="flex flex-row items-center space-x-2"
              >
                <Cog className="w-4 h-4" />
                <h1>Settings</h1>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  localStorage.removeItem("authenticated");
                  await router.push("/");
                }}
                className="flex flex-row items-center space-x-2 text-red-500"
              >
                <LogOut className="w-4 h-4" />
                <h1>Logout</h1>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header >
    </div >
  );
};

export default Header;
