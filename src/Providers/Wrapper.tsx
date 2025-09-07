"use client";
import React from "react";
import LenisProvider from "./Lenis";
import { Toaster } from "@/components/ui/sonner";
interface Props {
  children: React.ReactNode;
}
const Wrapper = ({ children }: Props) => {
  return (
    <>
      <Toaster position="top-right" richColors />
      {/* <LenisProvider> */}
      {children}
      {/* </LenisProvider> */}
    </>
  );
};

export default Wrapper;
