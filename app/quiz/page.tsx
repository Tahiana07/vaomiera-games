"use client";

import { useState, useEffect } from "react";
import QuizCard from "@/components/QuizCard";
import ScoreBar from "@/components/ScoreBar";
import { questions } from "@/data/questions";
import { shuffle } from "@/utils/shuffle";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function QuizPage() {
  const router = useRouter();

  const [shuffled, setShuffled] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setShuffled(shuffle(questions));

    const savedScore = localStorage.getItem("score");
    if (savedScore) setScore(Number(savedScore));
  }, []);

  const handleAnswer = (answer: string) => {
    if (!shuffled[index]) return;

    if (answer === shuffled[index].answer) {
      const newScore = score + 1;
      setScore(newScore);
      localStorage.setItem("score", String(newScore));
    }

    if (index + 1 >= shuffled.length) {
      router.push("/drag-drop");
    } else {
      setIndex(index + 1);
    }
  };

  if (!shuffled.length) return <p className="p-6">Chargement...</p>;

  return (
    <div className="p-6">
      <ScoreBar score={score} />

      <QuizCard
        key={index} // FIX sur index séléctionné dans l'état
        question={shuffled[index]}
        onAnswer={handleAnswer}
      />
    </div>
  );
}