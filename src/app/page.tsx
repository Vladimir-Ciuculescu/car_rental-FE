// app/page.tsx or app/page.js
"use client"; // Ensure this file is treated as a client component

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const user = localStorage.getItem("user");

  if (!user) {
    router.push("/login");
  } else {
    router.push("/dashboard/available-cars");
  }

  return null;
};

export default HomePage;
