import { Card } from "@/components/ui";
import FriendItem from "./FriendItem";

/**
 * FriendList - Lista de amigos
 */
export default function FriendList({ friends, onWatch }) {
  return (
    <Card variant="gradient" className="p-2 md:p-4 border-2 border-gold/30">
      {friends.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          Nenhum amigo encontrado.
        </div>
      ) : (
        friends.map((friend) => (
          <FriendItem key={friend.username} {...friend} onWatch={onWatch} />
        ))
      )}
    </Card>
  );
}
