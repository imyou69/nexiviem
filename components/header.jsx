import { checkUser } from "@/lib/checkUser";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import {
  ChevronDown,
  FileText,
  GraduationCap,
  LayoutDashboard,
  PenBox,
  StarsIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
  
  const Header =async () => {
    await checkUser();
    
    return (
      <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
        <nav className="w-full h-16 flex items-center px-0">
          {/* Logo Left Side */}
          <div className="flex-shrink-0 ">
            <a href="/">
              <Image
                src="/logo (1).png"
                alt="Sensai Logo"
                width={200}
                height={60}
                className="h-12 py-1 w-auto object-contain"
              />
            </a>
          </div>
  
          {/* Right Side Content */}
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            <SignedIn>
              <a href={"/dashboard"}>
                <Button variant="outline">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden md:block">Industry Insights</span>
                </Button>
              </a>
  
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <StarsIcon className="h-4 w-4" />
                    <span className="hidden md:block">Growth Tools</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <a href={"/resume"} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Build Resume</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a
                      href={"/ai-cover-letter"}
                      className="flex items-center gap-2"
                    >
                      <PenBox className="h-4 w-4" />
                      <span>Cover Letter</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a href={"/interview"} className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Mock Interview</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedIn>
  
            <SignedOut>
              <SignInButton>
                <Button variant="outline">Sign in</Button>
              </SignInButton>
            </SignedOut>
  
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "shadow-x1",
                    userPreviewMainIdentifier: "font-semibold",
                  },
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>
        </nav>
      </header>
    );
  };
  
  export default Header;
  