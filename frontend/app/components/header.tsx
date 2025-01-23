"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Globe } from "lucide-react";

export function Header() {
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const pathname = usePathname();

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));
  };

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className={pathname === "/" ? "font-bold" : ""}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/create"
                className={pathname === "/create" ? "font-bold" : ""}
              >
                Create
              </Link>
            </li>
            <li>
              <Link
                href="/generate"
                className={pathname === "/generate" ? "font-bold" : ""}
              >
                Generate
              </Link>
            </li>
          </ul>
        </nav>
        <Button size="sm" onClick={toggleLanguage}>
          <Globe className="mr-2 h-4 w-4" />
          {language === "en" ? "EN" : "FR"}
        </Button>
      </div>
    </header>
  );
}
