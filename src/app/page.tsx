"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const user = window.localStorage.getItem("user");

  if (!user) {
    router.push("/login");
  } else {
    router.push("/dashboard/available-cars");
  }

  return null;
};

export default HomePage;
