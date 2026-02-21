import React from "react";
import { FaYoutube, FaTiktok, FaTwitch, FaSnapchatGhost } from "react-icons/fa";

export default function SocialLinks() {
  const socialMedia = [
    { icon: <FaTiktok />, color: "bg-black", count: "12,000", name: "TikTok" },
    { icon: <FaYoutube />, color: "bg-red-600", count: "85,631", name: "YouTube" },
    { icon: <FaTwitch />, color: "bg-purple-700", count: "9,500", name: "Twitch" },
    { icon: <FaSnapchatGhost />, color: "bg-yellow-400", count: "4,200", name: "Snapchat" },
  ];

  return (
    <div className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] w-full p-4 sm:p-5 rounded-2xl shadow-xl border border-[#c29d5d]/40 text-white">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#e7c27d] drop-shadow flex items-center gap-2">
        🌐 Redes Sociais
      </h2>
      <div className="flex justify-around flex-wrap gap-2">
        {socialMedia.map((media, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-1">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow rounded-2xl ${media.color}`}
              title={media.name}
            >
              {media.icon}
            </div>
            <span className="text-xs font-bold text-[#e7c27d]">{media.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
