

import { FaChessRook } from "react-icons/fa";

export default function SocialHeader() {
  return (
    <div className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] rounded-2xl shadow-xl border-t-2 border-b-2 border-[#c29d5d]/30 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 mb-4 sm:mb-6">
      <span className="bg-[#444] p-2 rounded-full border border-[#c29d5d]/40 flex items-center justify-center">
        <FaChessRook size={28} className="text-[#e7c27d] drop-shadow" />
      </span>
      <h1 className="text-2xl md:text-3xl font-bold text-[#e7c27d] drop-shadow">Recursos</h1>
    </div>
  );
}
