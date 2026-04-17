import Styles from "./App.module.css";
import "./components/UI/GlobalCss/rootvariables.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore/Explore";
import BookDetailsPage from "./pages/bookdetails/BookDetailsPage"; 
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/authPages/LoginPage/LoginPage";
import SingupPage from "./pages/authPages/SingupPage/SingupPage";
import LibraryPage from "./pages/LibraryPage/LibraryPage";
import GenresPage from "./pages/GenresPage/GenresPage";
import ReadingPage from "./pages/ReadingPage/ReadingPage";
import WalletPage from "./pages/WalletPage/WalletPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import WritingDashboardPage from "./pages/WritingDashboardPage/WritingDashboardPage";
import WritingBookPage from "./pages/WritingBookPage/WritingBookPage";
import RadarTestPage from "./pages/RadarTestPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SingupPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/radar-test" element={<RadarTestPage />} />
        <Route path="/books/:type" element={<GenresPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
        <Route path="/book/reading/:bookId/:chapterId" element={<ReadingPage />} />
        <Route path="/wallet/buy" element={<WalletPage />} />
        <Route path="/author/:authorId" element={<ProfilePage />} />
        <Route path="/writing" element={<WritingDashboardPage />} />
        <Route path="/writing/:bookId" element={<WritingBookPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;