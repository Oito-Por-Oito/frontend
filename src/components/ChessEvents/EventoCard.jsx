import React from "react";

export default function EventoCard({ img, titulo, data }) {
  return (
    <div className="flex items-center bg-[#2a2a2a] rounded-lg p-3 gap-3 sm:gap-4 hover:bg-[#333] cursor-pointer">
      <img src={img} alt={titulo} className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-sm sm:text-base leading-snug">{titulo}</h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{data}</p>
      </div>
    </div>
  );
}
