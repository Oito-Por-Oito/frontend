
import App from './App';


import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Login from './pages/Login';
import Signup from './pages/Signup';
import RatingsPlayers from './pages/RatingsPlayers';
import PlayComputer from './pages/PlayComputer';
import Play from './pages/Play';
import Chessnews from './pages/Chessnews';

import ChessSocial from './pages/ChessSocial';
import ChessFriends from './pages/SocialChess/ChessFriends';
import ChessClubs from './pages/SocialChess/ChessClubs';
import ChessForum from './pages/SocialChess/ChessForum';
import ChessMembers from './pages/SocialChess/ChessMembers';
import ChessBlogs from './pages/SocialChess/ChessBlogs';

import PuzzleChess from './pages/PuzzleChess';  
import ChessEvents from './pages/ChessEvents';
import LearnChess from './pages/LearnChess';
import ChessMore from './pages/ChessMore';
import Donate from './pages/Donate';
import NotFoundPage from './pages/404Page';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/ratings-players' element={<RatingsPlayers />} />
        <Route path='/play-computer' element={<PlayComputer />} />
        <Route path='/play' element={<Play />} />
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
        <Route path="/donate" element={<Donate />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
