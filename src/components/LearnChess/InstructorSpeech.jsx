export default function InstructorSpeech({ avatar, text }) {
  return (
    <div className="flex items-start mb-4">
      <img
        src="/assets/img/coachdavid.png"
        alt="Instrutor"
        className="w-12 h-12 rounded-full mr-4 border-2 border-[#c29d5d]/60 shadow-lg bg-[#232526] object-cover"
      />
      <div className="bg-gradient-to-r from-[#232526] via-[#1a1a1a] to-[#232526] text-[#e7c27d] p-3 sm:p-4 rounded-2xl shadow-xl border-t-2 border-b-2 border-[#c29d5d]/30 font-medium text-sm sm:text-base w-full max-w-xl">
        {text}
      </div>
    </div>
  );
}
