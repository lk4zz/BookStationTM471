// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Global Styles
import Styles from "./App.module.css";
import "./components/UI/GlobalCss/rootvariables.css";

// Guards
import { ProtectedRoute, AdminRoute } from "./routes/AuthGuards";

// Pages
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/authPages/LoginPage/LoginPage";
import SingupPage from "./pages/authPages/SingupPage/SingupPage";
import Explore from "./pages/Explore/Explore";
import GenresPage from "./pages/GenresPage/GenresPage";
import BookDetailsPage from "./pages/bookdetails/BookDetailsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LibraryPage from "./pages/LibraryPage/LibraryPage";
import ReadingPage from "./pages/ReadingPage/ReadingPage";
import WalletPage from "./pages/WalletPage/WalletPage";
import WritingDashboardPage from "./pages/WritingDashboardPage/WritingDashboardPage";
import WritingBookPage from "./pages/WritingBookPage/WritingBookPage";
import AdminPage from "./pages/AdminPage/AdminPage"; // Create this page if you haven't!
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <BrowserRouter>

        <Routes>

          {/* 🟢 PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SingupPage />} />
          <Route path="/books/:type" element={<GenresPage />} />
          <Route path="/book/:id" element={<BookDetailsPage />} />
          <Route path="/author/:authorId" element={<ProfilePage />} />
          <Route path="/book/reading/:bookId/:chapterId" element={<ReadingPage />} />


          {/* 🟡 PROTECTED ROUTES (Requires Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/wallet/buy" element={<WalletPage />} />
            <Route path="/writing" element={<WritingDashboardPage />} />
            <Route path="/writing/:bookId" element={<WritingBookPage />} />
          </Route>

          {/* 🔴 ADMIN ROUTES (Requires Admin Role) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;