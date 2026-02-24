import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LoadingFallback from './components/ui/LoadingFallback';

// Lazy load all pages except App (home) for instant loading
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RatingsPlayers = lazy(() => import('./pages/RatingsPlayers'));
const Settings = lazy(() => import('./pages/Settings'));
const Donate = lazy(() => import('./pages/Donate'));
const NotFoundPage = lazy(() => import('./pages/404Page'));
const PlayerProfile = lazy(() => import('./pages/PlayerProfile'));
const Stats = lazy(() => import('./pages/Stats'));
const Goals = lazy(() => import('./pages/Goals'));

// Jogo
const Play = lazy(() => import('./pages/Play'));
const PlayComputer = lazy(() => import('./pages/PlayComputer'));
const PlayOnline = lazy(() => import('./pages/PlayOnline'));
const PlayTrainer = lazy(() => import('./pages/PlayTrainer'));
const Tournaments = lazy(() => import('./pages/Tournaments'));
const Variants = lazy(() => import('./pages/Variants'));
const Ranking = lazy(() => import('./pages/Ranking'));
const WatchGames = lazy(() => import('./pages/WatchGames'));
const WatchGame = lazy(() => import('./pages/WatchGame'));
const GameHistory = lazy(() => import('./pages/GameHistory'));
const GameReplay = lazy(() => import('./pages/GameReplay'));

// Puzzles
const PuzzleChess = lazy(() => import('./pages/PuzzleChess'));
const PuzzleProblems = lazy(() => import('./pages/Puzzles/PuzzleProblems'));
const PuzzleRush = lazy(() => import('./pages/Puzzles/PuzzleRush'));
const PuzzleBattle = lazy(() => import('./pages/Puzzles/PuzzleBattle'));
const PuzzleDaily = lazy(() => import('./pages/Puzzles/PuzzleDaily'));
const PuzzleCustom = lazy(() => import('./pages/Puzzles/PuzzleCustom'));

// Learn
const LearnChess = lazy(() => import('./pages/LearnChess'));
const LearnLessons = lazy(() => import('./pages/Learn/LearnLessons'));
const LearnCourses = lazy(() => import('./pages/Learn/LearnCourses'));
const LearnOpenings = lazy(() => import('./pages/Learn/LearnOpenings'));
const LearnEndgames = lazy(() => import('./pages/Learn/LearnEndgames'));
const LearnAnalysis = lazy(() => import('./pages/Learn/LearnAnalysis'));
const LearnClassroom = lazy(() => import('./pages/Learn/LearnClassroom'));
const LearnPractice = lazy(() => import('./pages/Learn/LearnPractice'));
const LearnLibrary = lazy(() => import('./pages/Learn/LearnLibrary'));
const LearnCriticalIdeas = lazy(() => import('./pages/Learn/LearnCriticalIdeas'));

// Watch
const Chessnews = lazy(() => import('./pages/Chessnews'));
const ChessEvents = lazy(() => import('./pages/ChessEvents'));
const WatchChessTV = lazy(() => import('./pages/Watch/WatchChessTV'));
const WatchEvents = lazy(() => import('./pages/Watch/WatchEvents'));
const WatchPlayingNow = lazy(() => import('./pages/Watch/WatchPlayingNow'));
const WatchStreamers = lazy(() => import('./pages/Watch/WatchStreamers'));

// News
const NewsHub = lazy(() => import('./pages/News/NewsHub'));
const NewsChessToday = lazy(() => import('./pages/News/NewsChessToday'));
const NewsArticles = lazy(() => import('./pages/News/NewsArticles'));
const NewsRankings = lazy(() => import('./pages/News/NewsRankings'));
const NewsTopPlayers = lazy(() => import('./pages/News/NewsTopPlayers'));

// Social
const ChessSocial = lazy(() => import('./pages/ChessSocial'));
const ChessFriends = lazy(() => import('./pages/SocialChess/ChessFriends'));
const ChessClubs = lazy(() => import('./pages/SocialChess/ChessClubs'));
const ChessForum = lazy(() => import('./pages/SocialChess/ChessForum'));
const ChessMembers = lazy(() => import('./pages/SocialChess/ChessMembers'));
const ChessBlogs = lazy(() => import('./pages/SocialChess/ChessBlogs'));
const ChessCoaches = lazy(() => import('./pages/SocialChess/ChessCoaches'));

// Mais
const ChessMore = lazy(() => import('./pages/ChessMore'));
const MaisAberturas = lazy(() => import('./pages/Mais/MaisAberturas'));
const MaisApps = lazy(() => import('./pages/Mais/MaisApps'));
const MaisExplorador = lazy(() => import('./pages/Mais/MaisExplorador'));
const MaisXadrezSolo = lazy(() => import('./pages/Mais/MaisXadrezSolo'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<App />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Perfil e conta */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ratings-players" element={<RatingsPlayers />} />

          {/* Jogo */}
          <Route path="/play" element={<Play />} />
          <Route path="/play-computer" element={<PlayComputer />} />
          <Route path="/play-online" element={<PlayOnline />} />
          <Route path="/play/trainer" element={<PlayTrainer />} />
          <Route path="/learn/trainer" element={<PlayTrainer />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/variants" element={<Variants />} />
          <Route path="/ranking" element={<Ranking />} />

          {/* Watch / Histórico */}
          <Route path="/watch" element={<WatchGames />} />
          <Route path="/watch/:gameId" element={<WatchGame />} />
          <Route path="/watch/chesstv" element={<WatchChessTV />} />
          <Route path="/watch/events" element={<WatchEvents />} />
          <Route path="/watch/playing-now" element={<WatchPlayingNow />} />
          <Route path="/watch/streamers" element={<WatchStreamers />} />
          <Route path="/history" element={<GameHistory />} />
          <Route path="/history/:gameId" element={<GameReplay />} />

          {/* Puzzles */}
          <Route path="/puzzle-chess" element={<PuzzleChess />} />
          <Route path="/puzzles" element={<PuzzleProblems />} />
          <Route path="/puzzles/problems" element={<PuzzleProblems />} />
          <Route path="/puzzles/rush" element={<PuzzleRush />} />
          <Route path="/puzzles/battle" element={<PuzzleBattle />} />
          <Route path="/puzzles/daily" element={<PuzzleDaily />} />
          <Route path="/puzzles/custom" element={<PuzzleCustom />} />

          {/* Learn */}
          <Route path="/learn" element={<LearnChess />} />
          <Route path="/learn/lessons" element={<LearnLessons />} />
          <Route path="/learn/courses" element={<LearnCourses />} />
          <Route path="/learn/openings" element={<LearnOpenings />} />
          <Route path="/learn/endgames" element={<LearnEndgames />} />
          <Route path="/learn/analysis" element={<LearnAnalysis />} />
          <Route path="/learn/classroom" element={<LearnClassroom />} />
          <Route path="/learn/practice" element={<LearnPractice />} />
          <Route path="/learn/library" element={<LearnLibrary />} />
          <Route path="/learn/critical-ideas" element={<LearnCriticalIdeas />} />

          {/* News */}
          <Route path="/news" element={<NewsHub />} />
          <Route path="/news/chess-today" element={<NewsChessToday />} />
          <Route path="/news/articles" element={<NewsArticles />} />
          <Route path="/news/rankings" element={<NewsRankings />} />
          <Route path="/news/top-players" element={<NewsTopPlayers />} />
          <Route path="/chessnews" element={<Chessnews />} />
          <Route path="/chess-events" element={<ChessEvents />} />

          {/* Social */}
          <Route path="/social" element={<ChessSocial />} />
          <Route path="/social/friends" element={<ChessFriends />} />
          <Route path="/social/clubs" element={<ChessClubs />} />
          <Route path="/social/forums" element={<ChessForum />} />
          <Route path="/social/members" element={<ChessMembers />} />
          <Route path="/social/blogs" element={<ChessBlogs />} />
          <Route path="/social/coaches" element={<ChessCoaches />} />

          {/* Mais */}
          <Route path="/mais" element={<ChessMore />} />

          {/* Donate */}
          <Route path="/donate" element={<Donate />} />
          <Route path="/mais/aberturas" element={<MaisAberturas />} />
          <Route path="/mais/apps" element={<MaisApps />} />
          <Route path="/mais/biblioteca" element={<LearnLibrary />} />
          <Route path="/mais/explorador" element={<MaisExplorador />} />
          <Route path="/mais/xadrez-solo" element={<MaisXadrezSolo />} />

          {/* Perfil público de jogadores */}
          <Route path="/player/:userId" element={<PlayerProfile />} />

          {/* Estatísticas e Metas */}
          <Route path="/stats" element={<Stats />} />
          <Route path="/goals" element={<Goals />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
