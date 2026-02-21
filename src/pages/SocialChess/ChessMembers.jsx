import { PageLayout, MainLayout } from "@/components/layout";
import { Card } from "@/components/ui";
import Header from "@/components/ChessMembers/Header";
import StatsRow from "@/components/ChessMembers/StatsRow";
import TitledPlayers from "@/components/ChessMembers/TitledPlayers";
import RecentOpponents from "@/components/ChessMembers/RecentOpponents";
import QuickLinks from "@/components/ChessMembers/QuickLinks";
import SearchCard from "@/components/ChessMembers/SearchCard";
import FriendsCard from "@/components/ChessMembers/FriendsCard";

function MembersSidebar() {
  return (
    <Card variant="elevated" className="flex flex-col gap-6">
      <QuickLinks />
      <SearchCard />
      <FriendsCard />
    </Card>
  );
}

function MembersContent() {
  return (
    <>
      <Header />
      <Card variant="elevated" className="flex flex-col gap-8">
        <StatsRow />
        <TitledPlayers />
        <RecentOpponents />
      </Card>
    </>
  );
}

export default function ChessMembers() {
  return (
    <PageLayout>
      <MainLayout sidebar={<MembersSidebar />}>
        <MembersContent />
      </MainLayout>
    </PageLayout>
  );
}
