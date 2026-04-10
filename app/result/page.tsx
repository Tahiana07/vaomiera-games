"use client";

import { useEffect, useState } from "react";

type Player = {
  name: string;
  score: number;
};

export default function Result() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const name = localStorage.getItem("player") || "Anonyme";
    const score = Number(localStorage.getItem("score") || 0);

    const stored: Player[] = JSON.parse(
      localStorage.getItem("ranking") || "[]"
    );

    const updated = [...stored, { name, score }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    localStorage.setItem("ranking", JSON.stringify(updated));
    setPlayers(updated);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🏆 Classement</h1>

      {players.map((p, i) => (
        <div key={i} className="p-3 bg-yellow-100 rounded-xl mb-2">
          {i + 1}. {p.name} - {p.score}
        </div>
      ))}
    </div>
  );
}