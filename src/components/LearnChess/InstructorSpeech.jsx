import { Card } from '../ui';

export default function InstructorSpeech({ avatar, text }) {
  return (
    <div className="flex items-start mb-4">
      <img
        src="/assets/img/coachdavid.png"
        alt="Instrutor"
        className="w-12 h-12 rounded-full mr-4 border-2 border-gold/60 shadow-lg bg-surface-secondary object-cover"
      />
      <Card variant="gradient" className="p-4 max-w-xl">
        <span className="font-medium text-base text-gold-light">{text}</span>
      </Card>
    </div>
  );
}
