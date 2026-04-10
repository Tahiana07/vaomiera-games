"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/home");
    }, 2000);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-blue-900 text-white">
      <h1 className="text-3xl font-bold animate-pulse">
        Vaomiera 🎉
      </h1>
    </div>
  );
}