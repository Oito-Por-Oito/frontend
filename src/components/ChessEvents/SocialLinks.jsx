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
    <div className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] w-full max-w-xs p-5 rounded-2xl shadow-xl border border-[#c29d5d]/40 text-white">
      <h2 className="text-xl font-bold mb-4 text-[#e7c27d] drop-shadow flex items-center gap-2">
        🌐 Redes Sociais
      </h2>
      <div className="flex justify-between flex-wrap gap-2">
        {socialMedia.map((media, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-1">
            <div
              className={`w-10 h-10 flex items-center justify-center shadow ${media.color}`}
              style={{ borderRadius: 20 }}
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
