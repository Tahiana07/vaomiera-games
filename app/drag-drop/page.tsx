"use client";

import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverlay
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
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    disabled
  });

  return (
    <div
      ref={setNodeRef}
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
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const handleDragStart = (event: any) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

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

    if (Object.keys(answers).length + 1 === dropZones.length) {
      setTimeout(() => router.push("/home"), 1500);
    }
  };

  const usedItems = Object.values(answers);
  const availableItems = dragItems.filter(
    (item) => !usedItems.includes(item.id)
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col max-w-md mx-auto">

        {/* HEADER */}
        <div className="p-4">
          <h1 className="text-xl font-bold text-center">
            🧩 Ataovy mifanaraka
          </h1>
          <p className="text-center font-medium mt-2">Score: {score}</p>
        </div>

        {/* DROP ZONES */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          {dropZones.map((zone: ItemProps) => (
            <Droppable
              key={zone.id}
              {...zone}
              answers={answers}
              itemsMap={itemsMap}
            />
          ))}
        </div>

        {/* DRAG ITEMS */}
        <div className="border-t bg-white p-3 max-h-[35vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {availableItems.map((item: ItemProps) => (
              <Draggable key={item.id} {...item} />
            ))}
          </div>
        </div>

      </div>

      {/* 🔥 DRAG OVERLAY (clé du fix) */}
      <DragOverlay>
        {activeId ? (
          <div className="px-4 py-3 bg-blue-500 text-white rounded-2xl shadow-xl scale-105">
            {itemsMap[activeId]}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}