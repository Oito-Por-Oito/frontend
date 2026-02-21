import Stat from "./Stat";

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Stat label="Online" value="214.458" />
      <Stat label="Entraram nas últimas 24 horas!" value="137.653" />
      <Stat label="Membros" value="221.919.057" />
    </div>
  );
}
