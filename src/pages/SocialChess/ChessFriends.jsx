import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserFriends, FaUserPlus, FaUserCheck, FaUserTimes, FaChess, FaSpinner } from "react-icons/fa";
import { PageLayout } from "@/components/layout";
import { Card } from "@/components/ui";
import ChallengeModal from "@/components/ChessFriends/ChallengeModal";
import { useFriends } from "@/hooks/useFriendship";
import { useChallenge } from "@/hooks/useChallenge";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

function FriendCard({ entry, onAccept, onDecline, onRemove, onCancel, type }) {
  const { profile, friendship } = entry;
  const [challenging, setChallenging] = useState(false);
  const { sendChallenge } = useChallenge(profile.user_id);
  const displayName = profile.display_name || profile.username || "Jogador";
  const initial = displayName[0]?.toUpperCase() || "?";

  const handleChallenge = async (opts) => {
    await sendChallenge(opts);
    setChallenging(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 p-3 rounded-xl border border-gold/10 bg-surface-secondary hover:border-gold/25 transition-all">
        <Link to={`/player/${profile.user_id}`} className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center text-sm font-bold text-gold flex-shrink-0 overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
            ) : initial}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground text-sm truncate">{displayName}</div>
            <div className="text-xs text-muted-foreground">
              {profile.username && `@${profile.username}`}
              {profile.rating_blitz && ` · ⚡${profile.rating_blitz}`}
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {type === "friends" && (
            <>
              <button
                onClick={() => setChallenging(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gold/20 hover:bg-gold/30 border border-gold/30 text-gold text-xs font-semibold rounded-lg transition-colors"
              >
                <FaChess size={11} /> Desafiar
              </button>
              <button
                onClick={() => onRemove(friendship.id)}
                className="p-1.5 text-muted-foreground hover:text-error transition-colors rounded-lg hover:bg-error/10"
                title="Remover amigo"
              >
                <FaUserTimes size={14} />
              </button>
            </>
          )}
          {type === "received" && (
            <>
              <button
                onClick={() => onAccept(friendship.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-success/20 border border-success/40 text-success text-xs font-semibold rounded-lg hover:bg-success/30 transition-colors"
              >
                <FaUserCheck size={11} /> Aceitar
              </button>
              <button
                onClick={() => onDecline(friendship.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-error/10 border border-error/30 text-error text-xs font-semibold rounded-lg hover:bg-error/20 transition-colors"
              >
                <FaUserTimes size={11} /> Recusar
              </button>
            </>
          )}
          {type === "sent" && (
            <button
              onClick={() => onCancel(friendship.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-surface-tertiary border border-gold/20 text-muted-foreground text-xs rounded-lg hover:text-error hover:border-error/40 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {challenging && (
        <ChallengeModal
          friend={profile}
          onClose={() => setChallenging(false)}
          onSend={handleChallenge}
        />
      )}
    </>
  );
}

function TabButton({ active, onClick, children, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
        active
          ? "bg-gold/20 border-gold text-gold"
          : "bg-surface-secondary border-gold/20 text-muted-foreground hover:border-gold/40 hover:text-foreground"
      }`}
    >
      {children}
      {badge > 0 && (
        <span className="bg-error text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

export default function ChessFriends() {
  const [tab, setTab] = useState("friends");
  const { friends, received, sent, loading, refreshing, acceptRequest, declineRequest, removeFriend, cancelRequest, refresh, totalPending } = useFriends();
  const { user } = useAuth();

  const currentList = tab === "friends" ? friends : tab === "received" ? received : sent;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-surface-secondary p-2.5 rounded-full border border-gold/30">
            <FaUserFriends className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gold">Amigos</h1>
            <p className="text-sm text-muted-foreground">{friends.length} amigo{friends.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="ml-auto p-2 bg-surface-secondary border border-gold/20 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            {refreshing ? <FaSpinner className="animate-spin w-4 h-4" /> : "↻"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          <TabButton active={tab === "friends"} onClick={() => setTab("friends")}>
            <FaUserCheck size={13} /> Amigos ({friends.length})
          </TabButton>
          <TabButton active={tab === "received"} onClick={() => setTab("received")} badge={totalPending}>
            <FaUserPlus size={13} /> Recebidas ({received.length})
          </TabButton>
          <TabButton active={tab === "sent"} onClick={() => setTab("sent")}>
            Enviadas ({sent.length})
          </TabButton>
        </div>

        {/* List */}
        <Card variant="gradient" className="border border-gold/20 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin w-8 h-8 text-gold" />
            </div>
          ) : currentList.length === 0 ? (
            <div className="text-center py-12">
              <FaUserFriends className="mx-auto mb-3 text-muted-foreground w-10 h-10" />
              <p className="text-muted-foreground text-sm">
                {tab === "friends" ? "Você ainda não tem amigos. Explore o ranking e adicione jogadores!" :
                 tab === "received" ? "Nenhuma solicitação recebida." : "Nenhuma solicitação enviada."}
              </p>
              {tab === "friends" && (
                <Link to="/ranking" className="mt-4 inline-block px-4 py-2 bg-gold/20 border border-gold/30 text-gold rounded-lg text-sm font-medium hover:bg-gold/30 transition-colors">
                  Ver Ranking
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {currentList.map(entry => (
                <FriendCard
                  key={entry.friendship.id}
                  entry={entry}
                  type={tab}
                  onAccept={acceptRequest}
                  onDecline={declineRequest}
                  onRemove={removeFriend}
                  onCancel={cancelRequest}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
