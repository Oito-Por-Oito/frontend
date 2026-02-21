import React, { useState } from "react";
import { Card } from '../ui';

export default function LessonList() {
  const initialLessons = [
    { id: 1, img: "/public/assets/pieces/wP.png" },
    { id: 2, img: "/public/assets/pieces/wN.png" },
    { id: 3, img: "/public/assets/pieces/wR.png" },
    { id: 4, img: "/public/assets/pieces/wB.png" },
    { id: 5, img: "/public/assets/pieces/wK.png" },
    { id: 6, img: "/public/assets/pieces/wQ.png" },
  ];
  const [activeId, setActiveId] = useState(2);

  return (
    <Card variant="gradient" className="p-8 flex flex-col items-center gap-7 mt-6 max-w-md mx-auto">
      <h3 className="text-gold-light text-xl font-bold mb-4 drop-shadow">Lessons</h3>
      <div className="flex flex-col gap-6 w-full items-center justify-center">
        <div className="flex flex-row gap-6 w-full items-center justify-center">
          {initialLessons.slice(0, 3).map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setActiveId(lesson.id)}
              className={`w-20 h-20 flex items-center justify-center rounded-2xl border-2 transition-all duration-200 shadow-xl text-white text-4xl font-bold cursor-pointer select-none ${
                activeId === lesson.id
                  ? "bg-gradient-to-r from-gold-light to-gold text-black border-gold scale-105"
                  : "bg-surface-secondary border-gold/30 opacity-70 hover:scale-105 hover:border-gold-light"
              }`}
            >
              <img src={lesson.img} alt="lesson piece" className="w-12 h-12 object-contain" />
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-6 w-full items-center justify-center">
          {initialLessons.slice(3, 6).map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setActiveId(lesson.id)}
              className={`w-20 h-20 flex items-center justify-center rounded-2xl border-2 transition-all duration-200 shadow-xl text-white text-4xl font-bold cursor-pointer select-none ${
                activeId === lesson.id
                  ? "bg-gradient-to-r from-gold-light to-gold text-black border-gold scale-105"
                  : "bg-surface-secondary border-gold/30 opacity-70 hover:scale-105 hover:border-gold-light"
              }`}
            >
              <img src={lesson.img} alt="lesson piece" className="w-12 h-12 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
