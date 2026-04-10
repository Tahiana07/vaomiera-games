"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Player = {
  name: string;
  score: number;
};

export default function Result() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  // Charger + ajouter joueur UNE FOIS
  useEffect(() => {
    const stored: Player[] = JSON.parse(
      localStorage.getItem("ranking") || "[]"
    );

    if (!added) {
      const name = localStorage.getItem("player") || "Anonyme";
      const score = Number(localStorage.getItem("score") || 0);

      const updated = [...stored, { name, score }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      localStorage.setItem("ranking", JSON.stringify(updated));
      setPlayers(updated);
      setAdded(true);
    }
  }, [added]);

  // Supprimer un joueur
  const deletePlayer = (index: number) => {
    const updated = players.filter((_, i) => i !== index);
    setPlayers(updated);
    localStorage.setItem("ranking", JSON.stringify(updated));
  };

  // Tout supprimer
  const clearAll = () => {
    localStorage.removeItem("ranking");
    setPlayers([]);
  };

  const home = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-white p-6">
      
      <h1 className="text-2xl font-bold text-center mb-6">
        🏆 Filaharana
      </h1>

      {/* Bouton clear */}
      <div className="flex justify-center mb-4">
        <button
          onClick={clearAll}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          🧹 Fafana daholo
        </button>
      </div>

      {/* Liste joueurs */}
      <div className="space-y-3 max-w-md mx-auto">
        {players.length === 0 && (
          <p className="text-center text-gray-500">
            Tsy misy mpilalao
          </p>
        )}

        {players.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-white rounded-2xl shadow"
          >
            <div>
              <p className="font-bold">
                {i === 0 && "🥇 "}
                {i === 1 && "🥈 "}
                {i === 2 && "🥉 "}
                {p.name}
              </p>
              <p className="text-sm text-gray-500">
                Score: {p.score}
              </p>
            </div>

            <button
              onClick={() => deletePlayer(i)}
              className="bg-red-400 text-white px-3 py-1 rounded-lg"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
        {/* Bouton home */}
        <div className="flex justify-center mt-6">
          <button
            onClick={home}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
          >
            🏠 Miverina
          </button>
        </div>
    </div>
  );
}