import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col w-screen  items-center justify-center h-screen relative gap-4">
      <div
        className='-z-10 opacity-25 absolute inset-0 bg-[url("/image/lightbg.jpg")] bg-cover bg-center
    dark:bg-[url("/image/darkbg.jpg")] '
      />
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute left-5 top-5",
        })}
      >
        <ArrowLeftIcon className="size-5" />
        <p className="text-sm font-medium">Back to Home</p>
      </Link>

      {children}
    </div>
  );
};

export default Layout;
