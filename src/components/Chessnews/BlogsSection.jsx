import React from "react";

export default function BlogsSection() {
  return (
    <section className="bg-gradient-to-br from-[#232526] via-[#2c2c2c] to-[#232526] rounded-2xl p-5 md:p-6 shadow border border-[#c29d5d]/10 w-full">
      <h3 className="text-2xl font-bold mb-4 text-[#c29d5d]">Blogs</h3>

      <div className="flex gap-4">
        <img
          src="assets/img/BlogImage.png"
          alt="Blog capa"
          className="w-48 h-32 md:w-64 md:h-40 object-cover rounded-2xl border-2 border-[#c29d5d]/30 shadow"
        />
        <div className="flex-1">
          <h4 className="font-bold text-lg md:text-xl text-[#e7c27d] mb-1">
            N.N. My 60 Memorable Games: Part I
          </h4>
          <p className="text-sm font-semibold text-gray-300 mb-1">
            Andr3w Sm1th
          </p>
          <p className="text-base text-white/80 leading-snug line-clamp-2">
            This Blog is the first part in a series about the chess player known anonymously as N.N. N.N. is a Latin abbreviation for "Nomen nescio" - literally translated a...
          </p>
        </div>
      </div>
    </section>
  );
}
