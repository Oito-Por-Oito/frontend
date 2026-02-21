import { Button } from '../ui';

export default function ActionButton({ icon, text, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="primary"
      size="md"
      className="flex items-center gap-3 w-full md:w-auto"
    >
      <span className="text-2xl drop-shadow">{icon}</span>
      <span className="font-semibold text-lg">{text}</span>
    </Button>
  );
}
