"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function QuizCard({ question, onAnswer }: any) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-3xl shadow-xl max-w-md mx-auto"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Question */}
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
        🧠 {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((opt: string, index: number) => {
          const isSelected = selected === opt;

          return (
            <motion.button
              key={opt}
              onClick={() => {
                setSelected(opt);
                setTimeout(() => onAnswer(opt), 300);
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                w-full p-4 rounded-2xl text-left font-medium transition-all
                ${
                  isSelected
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white border border-blue-200 hover:bg-blue-100"
                }
              `}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Petit feedback */}
      {selected && (
        <motion.p
          className="text-center mt-4 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
        </motion.p>
      )}
    </motion.div>
  );
}