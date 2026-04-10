"use client";

import { motion } from "framer-motion";

export default function QuizCard({ question, onAnswer }: any) {
  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold mb-4">{question.question}</h2>

      {question.options.map((opt: string) => (
        <button
          key={opt}
          onClick={() => onAnswer(opt)}
          className="block w-full p-3 mb-2 bg-blue-100 rounded-xl hover:bg-blue-200"
        >
          {opt}
        </button>
      ))}
    </motion.div>
  );
}