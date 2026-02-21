import { FaUserFriends } from "react-icons/fa";
import { Card } from '../ui';

export default function SocialHeader() {
  return (
    <Card variant="gradient" className="px-6 py-4 flex items-center gap-3 mb-6">
      <span className="bg-surface-tertiary p-2 rounded-full border border-gold/40 flex items-center justify-center">
        <FaUserFriends size={28} className="text-gold-light drop-shadow" />
      </span>
      <h1 className="text-2xl md:text-3xl font-bold text-gold-light drop-shadow">Social</h1>
    </Card>
  );
}
