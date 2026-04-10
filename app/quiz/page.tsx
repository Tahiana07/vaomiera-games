"use client";

import { useState } from "react";
import QuizCard from "@/components/QuizCard";
import ScoreBar from "@/components/ScoreBar";
import { questions } from "@/data/questions";
import { shuffle } from "@/utils/shuffle";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();
  const shuffled = shuffle(questions);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(
    Number(localStorage.getItem("score") || 0)
  );

  const handleAnswer = (answer: string) => {
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

  return (
    <div className="p-6">
      <ScoreBar score={score} />

      <QuizCard
        question={shuffled[index]}
        onAnswer={handleAnswer}
      />
    </div>
  );
}