"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/survey", label: "Survey" },
  { href: "/prototype", label: "Prototype" },
];

const NavBar = () => {
  const pathname = usePathname();
  if (pathname === "/prototype") {
    return null;
  }

  return (
    <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/uib-logo-dark.png"
                alt="University of Bergen"
                width={120}
                height={40}
                className="block dark:hidden h-8 w-auto object-contain"
              />
              <Image
                src="/uib-logo.png"
                alt="University of Bergen"
                width={120}
                height={40}
                className="hidden dark:block h-8 w-auto object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-black dark:text-zinc-50 font-medium"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

