"use client";

import {
  DndContext,
  useDraggable,
  useDroppable
} from "@dnd-kit/core";

import { useState, useEffect } from "react";
import { dragItems, dropZones } from "@/data/dragData";
import { useRouter } from "next/navigation";

function Draggable({ id, label }: any) {
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
      className="p-3 bg-blue-400 text-white rounded-xl cursor-grab"
    >
      {label}
    </div>
  );
}

function Droppable({ id, label }: any) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-xl border ${
        isOver ? "bg-green-300" : "bg-white"
      }`}
    >
      {label}
    </div>
  );
}

export default function DragDrop() {
  const router = useRouter();

  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const savedScore = localStorage.getItem("score");
    setScore(savedScore ? Number(savedScore) : 0);
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id === over.id) {
      const newScore = (score ?? 0) + 1;
      setScore(newScore);
      localStorage.setItem("score", String(newScore));
    }
  };

  return (
    <DndContext
      onDragEnd={(e) => {
        handleDragEnd(e);
        setTimeout(() => router.push("/result"), 1000);
      }}
    >
      <div className="p-4 space-y-6">
        <h1 className="text-xl font-bold">🧩 Ataovy mifanaraka</h1>

        <p>Score: {score ?? "..."}</p>

        <div className="flex gap-4 flex-wrap">
          {dragItems.map((item) => (
            <Draggable key={item.id} {...item} />
          ))}
        </div>

        <div className="space-y-3">
          {dropZones.map((zone) => (
            <Droppable key={zone.id} {...zone} />
          ))}
        </div>
      </div>
    </DndContext>
  );
}