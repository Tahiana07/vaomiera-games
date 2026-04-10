"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const router = useRouter();

  const start = () => {
    if (!name.trim()) return;

    localStorage.setItem("player", name);
    localStorage.setItem("score", "0");

    router.push("/quiz");
  };

  const result = () => {

    router.push("/result");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">🎮 Lalao Vaomiera</h1>

      <input
        placeholder="Ampidiro ny anaranao"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-3 rounded-xl mb-4 w-full max-w-sm"
      />

      <button
        onClick={start}
        className="bg-blue-500 text-white p-4 rounded-2xl w-full max-w-sm"
      >
        Hanomboka 🚀
      </button>

      <button
        onClick={result}
        className="bg-yellow-500 disabled:opacity-50 text-white p-4 m-2 rounded-2xl w-full max-w-sm"
      >
        Valiny 🏆
      </button>
    </div>
  );
}