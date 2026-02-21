
import React, { useState } from "react";

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
    <div className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] rounded-3xl p-4 sm:p-8 shadow-2xl border-t-2 border-b-2 border-[#c29d5d]/30 flex flex-col items-center gap-4 sm:gap-7 mt-6 max-w-md mx-auto w-full">
      <h3 className="text-[#e7c27d] text-xl font-bold mb-4 drop-shadow">Lessons</h3>
      <div className="flex flex-col gap-6 w-full items-center justify-center">
        <div className="flex flex-row gap-3 sm:gap-6 w-full items-center justify-center">
          {initialLessons.slice(0, 3).map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setActiveId(lesson.id)}
              className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl border-2 transition-all duration-200 shadow-xl text-white text-4xl font-bold cursor-pointer select-none ${
                activeId === lesson.id
                  ? "bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black border-[#c29d5d] scale-105"
                  : "bg-[#232526] border-[#c29d5d]/30 opacity-70 hover:scale-105 hover:border-[#e7c27d]"
              }`}
            >
              <img src={lesson.img} alt="lesson piece" className="w-12 h-12 object-contain" />
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-3 sm:gap-6 w-full items-center justify-center">
          {initialLessons.slice(3, 6).map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setActiveId(lesson.id)}
              className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl border-2 transition-all duration-200 shadow-xl text-white text-4xl font-bold cursor-pointer select-none ${
                activeId === lesson.id
                  ? "bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black border-[#c29d5d] scale-105"
                  : "bg-[#232526] border-[#c29d5d]/30 opacity-70 hover:scale-105 hover:border-[#e7c27d]"
              }`}
            >
              <img src={lesson.img} alt="lesson piece" className="w-12 h-12 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
