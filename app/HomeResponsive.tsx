
"use client";

import { useEffect, useState } from "react";
import HomeClient from "./HomeClient";
import CustomerLandingPage from "./components/CustomerLandingPage";


export default function HomeResponsive() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleScreenChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleScreenChange();

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  if (isMobile === null) {
    return null;
  }

  return isMobile ? <CustomerLandingPage /> : <HomeClient />;
}
