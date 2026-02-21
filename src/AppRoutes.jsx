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
const PlayComputer = lazy(() => import('./pages/PlayComputer'));
const PlayOnline = lazy(() => import('./pages/PlayOnline'));
const Play = lazy(() => import('./pages/Play'));
const WatchGames = lazy(() => import('./pages/WatchGames'));
const WatchGame = lazy(() => import('./pages/WatchGame'));
const GameHistory = lazy(() => import('./pages/GameHistory'));
const GameReplay = lazy(() => import('./pages/GameReplay'));
const Chessnews = lazy(() => import('./pages/Chessnews'));
const ChessSocial = lazy(() => import('./pages/ChessSocial'));
const ChessFriends = lazy(() => import('./pages/SocialChess/ChessFriends'));
const ChessClubs = lazy(() => import('./pages/SocialChess/ChessClubs'));
const ChessForum = lazy(() => import('./pages/SocialChess/ChessForum'));
const ChessMembers = lazy(() => import('./pages/SocialChess/ChessMembers'));
const ChessBlogs = lazy(() => import('./pages/SocialChess/ChessBlogs'));
const PuzzleChess = lazy(() => import('./pages/PuzzleChess'));
const LearnChess = lazy(() => import('./pages/LearnChess'));
const ChessEvents = lazy(() => import('./pages/ChessEvents'));
const ChessMore = lazy(() => import('./pages/ChessMore'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFoundPage = lazy(() => import('./pages/404Page'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/ratings-players' element={<RatingsPlayers />} />
          <Route path='/play-computer' element={<PlayComputer />} />
          <Route path='/play-online' element={<PlayOnline />} />
          <Route path='/play' element={<Play />} />
          <Route path='/watch' element={<WatchGames />} />
          <Route path='/watch/:gameId' element={<WatchGame />} />
          <Route path='/history' element={<GameHistory />} />
          <Route path='/history/:gameId' element={<GameReplay />} />
          <Route path='/chessnews' element={<Chessnews />} />

          <Route path='/social' element={<ChessSocial />} />
          <Route path="/social/friends" element={<ChessFriends />} />
          <Route path="/social/clubs" element={<ChessClubs />} />
          <Route path="/social/forums" element={<ChessForum />} />
          <Route path="/social/members" element={<ChessMembers />} />
          <Route path="/social/blogs" element={<ChessBlogs />} />

          <Route path="/puzzle-chess" element={<PuzzleChess />} />
          <Route path="/learn" element={<LearnChess />} />
          <Route path="/chess-events" element={<ChessEvents />} />
          <Route path="/mais" element={<ChessMore />} />
          <Route path="/settings" element={<Settings />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
