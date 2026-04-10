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

type AnswerMap = Record<string, string>;

function Draggable({ id, label, disabled }: ItemProps & { disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: disabled ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="px-4 py-3 bg-blue-500 text-white rounded-2xl text-center shadow-md touch-none active:scale-95 transition"
    >
      {label}
    </div>
  );
}

function Droppable({
  id,
  label,
  answers,
  itemsMap
}: ItemProps & {
  answers: AnswerMap;
  itemsMap: Record<string, string>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const droppedItem = answers[id];

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-2xl border-2 min-h-[70px] flex flex-col justify-center transition ${
        isOver ? "border-green-400 bg-green-50" : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-sm text-gray-500 mb-1">{label}</p>

      {droppedItem ? (
        <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded-xl text-center font-medium">
          {itemsMap[droppedItem]}
        </div>
      ) : (
        <p className="text-gray-300 text-sm text-center">Apetraho eto</p>
      )}
    </div>
  );
}

export default function DragDrop() {
  const router = useRouter();

  const [score, setScore] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  // map id -> label (utile affichage)
  const itemsMap = Object.fromEntries(
    dragItems.map((item) => [item.id, item.label])
  );

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

    // empêcher double utilisation
    const alreadyUsed = Object.values(answers).includes(activeId);
    if (alreadyUsed) return;

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

  // items restants (non utilisés)
  const usedItems = Object.values(answers);
  const availableItems = dragItems.filter(
    (item) => !usedItems.includes(item.id)
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={(e) => {
        handleDragEnd(e);

        // redirection si tout rempli | mbola tsy fantatra
        if (Object.keys(answers).length + 1 === dropZones.length) {
          setTimeout(() => router.push("/home"), 1500);
        }
      }}
    >
      <div className="p-4 max-w-md mx-auto space-y-6">
        <h1 className="text-xl font-bold text-center">
          🧩 Ataovy mifanaraka
        </h1>

        <p className="text-center font-medium">Score: {score}</p>

        {/* DROP ZONES (top) */}
        <div className="space-y-3">
          {dropZones.map((zone: ItemProps) => (
            <Droppable
              key={zone.id}
              {...zone}
              answers={answers}
              itemsMap={itemsMap}
            />
          ))}
        </div>

        {/* DRAG ITEMS (bottom) */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          {availableItems.map((item: ItemProps) => (
            <Draggable key={item.id} {...item} />
          ))}
        </div>
      </div>
    </DndContext>
  );
}