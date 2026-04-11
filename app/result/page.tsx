"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

type Player = {
  id?: string;
  name: string;
  score: number;
};

export default function Result() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔥 Charger + ajouter UNE FOIS
  useEffect(() => {
    const run = async () => {
      const supabase = getSupabase();
      const name = localStorage.getItem("player") || "Anonyme";
      const score = Number(localStorage.getItem("score") || 0);

      const alreadySaved = sessionStorage.getItem("saved");

      // ✅ insert une seule fois
      if (!alreadySaved) {
        await supabase.from("ranking").insert([{ name, score }]);
        sessionStorage.setItem("saved", "true");
      }

      // ✅ fetch classement
      const { data } = await supabase
        .from("ranking")
        .select("*")
        .order("score", { ascending: false })
        .limit(10);

      setPlayers(data || []);
      setLoading(false);
    };

    run();
  }, []);

  // ❌ Supprimer un joueur (DB)
  const deletePlayer = async (id: string) => {
    const supabase = getSupabase();
    await supabase.from("ranking").delete().eq("id", id);

    const updated = players.filter((p) => p.id !== id);
    setPlayers(updated);
  };

  // 🧹 Tout supprimer (DB)
  const clearAll = async () => {
    const supabase = getSupabase();
    await supabase.from("ranking").delete().neq("id", "");

    setPlayers([]);
  };

  const home = () => {
    sessionStorage.removeItem("saved");
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-white p-6">
      
      <h1 className="text-2xl font-bold text-center mb-6">
        🏆 Filaharana Global
      </h1>

      {/* Bouton clear */}
      <div className="flex justify-center mb-4">
        <button
          onClick={clearAll}
          className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          🧹 Fafana daholo
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 animate-pulse">
          Mampiditra...
        </p>
      )}

      {/* Liste */}
      <div className="space-y-3 max-w-md mx-auto">
        {players.length === 0 && !loading && (
          <p className="text-center text-gray-500">
            Tsy misy mpilalao
          </p>
        )}

        {players.map((p, i) => (
          <div
            key={p.id}
            className={`
              flex items-center justify-between p-4 rounded-2xl shadow
              ${i === 0 ? "bg-yellow-300" : "bg-white"}
            `}
          >
            <div>
              <p className="font-bold">
                {i === 0 && "🥇 "}
                {i === 1 && "🥈 "}
                {i === 2 && "🥉 "}
                {p.name}
              </p>
              <p className="text-sm text-gray-600">
                Score: {p.score}
              </p>
            </div>

            <button
              onClick={() => deletePlayer(p.id!)}
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
          className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          🏠 Miverina
        </button>
      </div>
    </div>
  );
}