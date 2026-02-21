import React from "react";

export default function ChessBoardStatic() {
  return (
    <div className="relative my-2">
      <div className="grid grid-cols-8 w-[380px] md:w-[650px] border-4 border-[#c29d5d] rounded-2xl shadow-2xl overflow-hidden">
        {[...Array(64)].map((_, i) => {
          const x = i % 8;
          const y = Math.floor(i / 8);
          const isLight = (x + (8 - y)) % 2 === 0;
          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center text-2xl select-none transition-all duration-100 ${
                isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"
              }`}
            >
              {/* Peças podem ser adicionadas aqui se desejar */}
            </div>
          );
        })}
      </div>
      {/* Notação horizontal A-H */}
      <div className="absolute bottom-[-24px] left-0 w-full grid grid-cols-8 text-center text-sm text-white/70 font-medium">
        {"abcdefgh".split("").map((letter) => (
          <div key={letter}>{letter.toUpperCase()}</div>
        ))}
      </div>
      {/* Notação vertical 8-1 */}
      <div className="absolute top-0 left-[-20px] h-full grid grid-rows-8 text-sm text-white/70 font-medium">
        {[8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
          <div key={num} className="flex items-center justify-center h-full">
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}
