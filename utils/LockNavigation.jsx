// src/components/LockNavigation.jsx
import { useEffect } from "react";

const LockNavigation = () => {
  useEffect(() => {
    // Prevent back and forward navigation
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
};

export default LockNavigation;
