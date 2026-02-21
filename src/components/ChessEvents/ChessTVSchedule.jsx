import React from "react";

export default function ChessTVSchedule() {
  const hours = [
    "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM",
    "8 AM", "9 AM", "10 AM", "11 AM",
    "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
    "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
  ];

  return (
    <div className="bg-[#181818]/90 border border-[#c29d5d]/20 shadow-lg p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#c29d5d]">Programação do ChessTV</h2>
        <a href="#" className="text-[#c29d5d] text-sm hover:underline">Programação Completa</a>
      </div>
      <div className="grid grid-cols-4 border-t border-gray-600">
        <div className="col-span-1">
          {hours.map((h, i) => (
            <div key={i} className="border-b border-gray-700 py-1 text-white/80">{h}</div>
          ))}
        </div>
        <div className="col-span-3 border-l border-gray-700">
          {hours.map((_, i) => (
            <div key={i} className="border-b border-gray-700 py-1"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
