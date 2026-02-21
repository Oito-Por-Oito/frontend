import { FaBlog } from 'react-icons/fa';

export default function HeaderBar({ title }) {
  return (
    <div className="bg-gradient-to-r from-[#232526] via-[#181818] to-[#232526] border-b-2 border-[#c29d5d]/30 shadow">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
        <span className="h-9 w-9 rounded-full bg-[#232526] border-2 border-[#c29d5d]/40 grid place-items-center text-2xl text-[#e7c27d] shadow">
          <FaBlog />
        </span>
        <h1 className="text-xl sm:text-3xl font-bold text-[#e7c27d] drop-shadow">{title}</h1>
      </div>
    </div>
  );
}
