import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useUserProgress } from "@/hooks/useUserProgress";
import LoadingFallback from "@/components/ui/LoadingFallback";
import WelcomeCard from "./WelcomeCard";
import DailyGoalsCard from "./DailyGoalsCard";
import ContinueWhereYouLeftCard from "./ContinueWhereYouLeftCard";
import ProgressCard from "./ProgressCard";
import RatingEvolutionCard from "./RatingEvolutionCard";
import RecentActivityCard from "./RecentActivityCard";
import QuickActionsCard from "./QuickActionsCard";
import PlayerStatsCard from "./PlayerStatsCard";

export default function DashboardContainer() {
  const { user } = useAuth();
  const { progress, loading } = useUserProgress();

  if (loading || !progress) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingFallback />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8"
    >
      {/* Grid responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Welcome Card - Full width on mobile, 2 cols on tablet+ */}
        <div className="md:col-span-2 xl:col-span-2">
          <WelcomeCard
            user={user}
            streak={progress.streak}
            lastSeen={progress.lastSeen}
          />
        </div>

        {/* Quick Actions - Right side on desktop */}
        <div className="xl:row-span-2">
          <QuickActionsCard />
        </div>

        {/* Player Stats - NEW */}
        <div className="md:col-span-2 xl:col-span-2">
          <PlayerStatsCard />
        </div>

        {/* Daily Goals */}
        <div>
          <DailyGoalsCard dailyGoals={progress.dailyGoals} />
        </div>

        {/* Continue Where You Left */}
        <div>
          <ContinueWhereYouLeftCard continueFrom={progress.continueFrom} />
        </div>

        {/* Rating Evolution - Larger card */}
        <div className="md:col-span-2">
          <RatingEvolutionCard ratingHistory={progress.ratingHistory} />
        </div>

        {/* Progress Stats */}
        <div>
          <ProgressCard stats={progress.stats} />
        </div>

        {/* Recent Activity - Full width on mobile */}
        <div className="md:col-span-2 xl:col-span-2">
          <RecentActivityCard recentActivity={progress.recentActivity} />
        </div>
      </div>
    </motion.div>
  );
}
