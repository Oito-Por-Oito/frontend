export default function CardItem({ icon, title, description, bgColor }) {
  return (
    <div
      className={`flex flex-col items-start p-3 sm:p-4 rounded-md cursor-pointer hover:scale-105 transition-transform ${bgColor}`}
    >
      <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{icon}</div>
      <h3 className="text-base sm:text-lg font-bold mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-300">{description}</p>
    </div>
  );
}
