"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../utils/token";

export const useAdminAuth = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      alert("Access denied. Redirecting to login...");
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, []);

  return isAuthorized;
};
