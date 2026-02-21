import FriendItem from "./FriendItem";
import { Card } from '../ui';

export default function FriendList({ friends, onWatch }) {
  return (
    <Card variant="gradient" className="p-2 md:p-4 mb-4">
      {friends.length === 0 ? (
        <div className="text-center text-text-muted py-8">Nenhum amigo encontrado.</div>
      ) : (
        friends.map((friend) => (
          <FriendItem key={friend.username} {...friend} onWatch={onWatch} />
        ))
      )}
    </Card>
  );
}
