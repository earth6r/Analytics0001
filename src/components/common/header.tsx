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
import { Menu, Package2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

const Header = () => {
  const router = useRouter();

  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    setProfilePictureUrl(localStorage.getItem("profilePictureUrl"));
    setName(localStorage.getItem("name"));
  }, []);

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
            Registers
          </Link>
          <Link
            href="/messages"
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              router.pathname === "/messages"
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Messages
          </Link>
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
                Registers
              </Link>
              <Link
                href="/messages"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  router.pathname === "/messages"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                Messages
              </Link>
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
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      profilePictureUrl ?? name
                        ? `https://ui-avatars.com/api/?name=${name}`
                        : undefined
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
                  await router.push("/settings");
                }}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await router.push("/stats");
                }}
              >
                Home
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  localStorage.removeItem("authenticated");
                  await router.push("/");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default Header;
