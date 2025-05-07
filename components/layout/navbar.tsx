"use client";

import React, { useState } from "react";
import { Github, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { motion, AnimatePresence } from "framer-motion";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  { href: "https://pythonforall.com/", label: "Home" },
  { href: "https://pythonforall.com/python", label: "Python" },
  { href: "https://pythonforall.com/modules", label: "Python Modules" },
  { href: "https://pythonforall.com/projects", label: "Projects" },
  { href: "https://pythonforall.com/student-corner", label: "Student Corner" },
  { href: "https://pythonforall.com/practice", label: "Practice Corner" },
  { href: "https://pythonforall.com/pyground", label: "Pyground" },
  { href: "https://blog.pythonforall.com/", label: "Blog" },
  { href: "https://pythonforall.com/about", label: "About" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveTimeout, setLeaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const navbarVariants = {
    hidden: { opacity: 0, y: -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const handleMouseEnter = (href: string) => {
    if (leaveTimeout) clearTimeout(leaveTimeout); // Cancel the leave timeout if hovering again
    setIsLeaving(false);
    setHoveredLink(href);
  };

  const handleMouseLeave = () => {
    setIsLeaving(true);
    const timeout = setTimeout(() => {
      if (isLeaving) {
        setHoveredLink(null); // Reset hoveredLink after the delay
      }
    }, 300); // Delay before closing
    setLeaveTimeout(timeout);
  };

  return (
    <motion.header
      className="shadow shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[95%] lg:max-w-screen-[95%] top-5 mx-auto sticky border-2 border-accent z-40 rounded-2xl flex justify-between items-center p-2 bg-background/40 backdrop-blur-[3px]"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <Button variant="ghost" className="hover:bg-accent">
        <Link href="/" className="font-bold text-lg flex items-center">
          <Image
            src="/pfa_logo.ico"
            alt="PythonForAll Logo"
            width={36}
            height={36}
            className="mr-2"
          />
          PythonForAll Blog
        </Link>
      </Button>

      {/* Mobile */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-background/80 backdrop-blur-[3px] border-accent"
          >
            <div>
              <SheetHeader className="mb-4 ml-4">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/pfa_logo.ico"
                      alt="PythonForAll Logo"
                      width={36}
                      height={36}
                      className="mr-2"
                    />
                    PythonForAll Blog
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {routeList.map(({ href, label }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base font-bold"
                  >
                    <Link className="link" href={href}>
                      {label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
              <ModeToggle />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex lg:flex-1 lg:justify-center">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="flex justify-center">
            <NavigationMenuItem>
              {routeList.map(({ href, label }) => (
                <NavigationMenuLink key={href} asChild>
                  <Link
                    href={href}
                    className="text-base px-4 py-2 font-bold text-accent hover:text-accent transition-all duration-200 rounded-md cursor-pointer relative"
                    onMouseEnter={() => handleMouseEnter(href)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {label}
                    {/* Underline effect */}
                    <AnimatePresence>
                      {hoveredLink === href && (
                        <motion.span
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-accent"
                          initial={{ width: "0%" }}
                          animate={{ width: "50%" }}
                          exit={{ width: "0%" }}
                          transition={{ duration: 0.2 }}
                        ></motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </NavigationMenuLink>
              ))}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* ModeToggle only in desktop */}
      <div className="hidden lg:flex">
        <ModeToggle />
      </div>
    </motion.header>
  );
};
