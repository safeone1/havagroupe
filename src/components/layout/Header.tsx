"use client";

import NavBar from "./NavBar";

interface HeaderProps {
  className?: string;
  isHome?: boolean;
}

const Header = ({ className, isHome = false }: HeaderProps) => {
  return <NavBar className={className} isHome={isHome} />;
};

export default Header;
