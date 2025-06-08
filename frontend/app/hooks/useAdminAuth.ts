"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../utils/token";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useAdminAuth = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useSelector((state: RootState)=>state.user.user);

  useEffect(() => {
    const token = getToken();
    const role = user?.role

    if (!token || role !== "admin") {
      alert("Access denied. Redirecting to login...");
      router.push("/login");
    } else {
      setIsAuthorized(true);
    }
  }, []);

  return isAuthorized;
};
