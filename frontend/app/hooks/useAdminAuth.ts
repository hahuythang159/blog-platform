"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../utils/token";

export const useAdminAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      alert("Unauthorized. Redirecting...");
      router.push("/login");
    }
  }, []);
};
