import FriendItem from "../../components/ChessFriends/FriendItem";

export default function FriendList({ friends, onWatch }) {
  return (
    <div className="bg-gradient-to-br from-[#232526] via-[#1a1a1a] to-[#232526] rounded-2xl shadow-xl border-2 border-[#c29d5d]/30 p-2 sm:p-4 mb-4">
      {friends.length === 0 ? (
        <div className="text-center text-gray-400 py-8">Nenhum amigo encontrado.</div>
      ) : (
        friends.map((friend) => (
          <FriendItem key={friend.username} {...friend} onWatch={onWatch} />
        ))
      )}
    </div>
  );
}
