"use client";

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
import { Car, CircleUser, Menu, Package2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "./ui/separator";

const NavBar = () => {
  const user: any = localStorage.getItem("user");
  const parsedUser = JSON.parse(user!);
  const router = useRouter();

  const pathname = usePathname();

  const activeLinkClass =
    "text-foreground transition-colors hover:text-foreground whitespace-nowrap";
  const inactiveLinkClass =
    "text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap";

  const logOut = () => {
    router.push("/login");
    localStorage.clear();
  };

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Car className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <Link
          href="/dashboard/available-cars"
          className={`${
            pathname === "/dashboard/available-cars"
              ? activeLinkClass
              : inactiveLinkClass
          }`}
        >
          Available cars
        </Link>
        <Link
          href="/dashboard/list-a-car"
          className={`${
            pathname === "/dashboard/list-a-car"
              ? activeLinkClass
              : inactiveLinkClass
          }`}
        >
          List a car
        </Link>
        <Link
          href="/dashboard/requests"
          className={`${
            pathname === "/dashboard/requests"
              ? activeLinkClass
              : inactiveLinkClass
          }`}
        >
          Requests
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
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
              href="/dashboard/available-cars"
              className="hover:text-foreground"
            >
              Available Cars
            </Link>
            <Link
              href="/dashboard/list-a-car"
              className="text-muted-foreground hover:text-foreground"
            >
              List a car
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial"></form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              {parsedUser.firstName + " " + parsedUser.lastName}
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavBar;
