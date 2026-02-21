

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Header from "../../components/ChessMembers/Header";
import StatsRow from "../../components/ChessMembers/StatsRow";
import TitledPlayers from "../../components/ChessMembers/TitledPlayers";
import RecentOpponents from "../../components/ChessMembers/RecentOpponents";
import QuickLinks from "../../components/ChessMembers/QuickLinks";
import SearchCard from "../../components/ChessMembers/SearchCard";
import FriendsCard from "../../components/ChessMembers/FriendsCard";

export default function ChessMembers() {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#232526] via-[#181818] to-[#232526] text-white overflow-x-hidden">
			<Navbar />
			<main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
				{/* coluna esquerda */}
				<section className="flex flex-col gap-8">
					<Header />
					<div className="bg-[#181818]/90 border border-[#c29d5d]/20 shadow-lg p-6 rounded-2xl flex flex-col gap-8">
						<StatsRow />
						<TitledPlayers />
						<RecentOpponents />
					</div>
				</section>

				{/* sidebar */}
				<aside className="w-full flex flex-col gap-8 mt-8 lg:mt-0">
					<div className="bg-[#181818]/90 border border-[#c29d5d]/20 shadow-lg rounded-2xl p-4 flex flex-col gap-6">
						<QuickLinks />
						<SearchCard />
						<FriendsCard />
					</div>
				</aside>
			</main>
			<Footer />
		</div>
	);
}
