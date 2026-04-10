"use client";

import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor
} from "@dnd-kit/core";

import { useState, useEffect } from "react";
import { dragItems, dropZones } from "@/data/dragData";
import { useRouter } from "next/navigation";

type ItemProps = {
  id: string;
  label: string;
};

function Draggable({ id, label }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 bg-blue-400 text-white rounded-xl cursor-grab touch-none"
    >
      {label}
    </div>
  );
}

function Droppable({
  id,
  label,
  answers
}: ItemProps & { answers: Record<string, string> }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-xl border ${
        isOver ? "bg-green-300" : "bg-white"
      }`}
    >
      <p className="font-semibold">{label}</p>

      {answers[id] && (
        <p className="mt-2 text-blue-600">✔ {answers[id]}</p>
      )}
    </div>
  );
}

export default function DragDrop() {
  const router = useRouter();

  const [score, setScore] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    const savedScore = localStorage.getItem("score");
    if (savedScore) setScore(Number(savedScore));
  }, []);

  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // FIX TYPE
    setAnswers((prev) => ({
      ...prev,
      [overId]: activeId,
    }));

    if (activeId === overId) {
      const newScore = score + 1;
      setScore(newScore);
      localStorage.setItem("score", String(newScore));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(e) => {
        handleDragEnd(e);
        setTimeout(() => router.push("/result"), 10000);
      }}
    >
      <div className="p-4 space-y-6">
        <h1 className="text-xl font-bold">🧩 Ataovy mifanaraka</h1>

        <p>Score: {score}</p>

        <div className="flex gap-4 flex-wrap">
          {dragItems.map((item: ItemProps) => (
            <Draggable key={item.id} {...item} />
          ))}
        </div>

        <div className="space-y-3">
          {dropZones.map((zone: ItemProps) => (
            <Droppable key={zone.id} {...zone} answers={answers} />
          ))}
        </div>
      </div>
    </DndContext>
  );
}