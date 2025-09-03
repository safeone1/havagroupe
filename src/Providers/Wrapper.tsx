import React from "react";
import LenisProvider from "./Lenis";

interface Props {
  children: React.ReactNode;
}
const Wrapper = ({ children }: Props) => {
  return (
    <>
      <LenisProvider>{children}</LenisProvider>
    </>
  );
};

export default Wrapper;
