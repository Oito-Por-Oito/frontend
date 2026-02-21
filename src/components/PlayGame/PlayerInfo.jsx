import React from "react";

export default function PlayerInfo({ avatar, name, rating, flagUrl, flagAlt = "", isBot }) {
  return (
    <div
      className={`flex items-center justify-start w-full border border-[#d4af37] bg-[#232526]/70 rounded-xl px-3 py-2 shadow-md ${isBot ? "mb-1" : "mt-4"}`}
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <img
          src={avatar}
          alt={isBot ? "Bot avatar" : "User avatar"}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-[#d4af37] bg-[#232526]"
          draggable={false}
        />
        <span className="flex items-center gap-1 font-semibold text-white truncate text-base md:text-lg">
          {name}
          {flagUrl ? (
            <img
              src={flagUrl}
              alt={flagAlt}
              className="w-5 h-4 object-cover rounded-sm border border-[#444] bg-[#232526] align-middle"
              title={flagAlt}
              draggable={false}
            />
          ) : (
            <span className="w-5 h-4 ml-1 bg-gray-500 rounded-sm border border-[#444] align-middle text-[10px] flex items-center justify-center text-white px-1">--</span>
          )}
        </span>
      </div>
      <span className="font-bold text-[#d4af37] text-base md:text-lg ml-2">{rating}</span>
    </div>
  );
}
