// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster, useToasterStore, toast } from 'react-hot-toast'; // Updated import

// Global Styles
import Styles from "./App.module.css";
import "./GlobalComponents/Theme/rootvariables.css";

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
import AdminPage from "./pages/AdminPage/AdminPage"; 

function AppRoutes() {
  return (
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
  );
}

function App() {
  // 1. Hook into the toast store
  const { toasts } = useToasterStore();

  // 2. The Bouncer: Enforce a strict limit of 1 toast on screen
  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Find all currently visible toasts
      .filter((_, i) => i >= 1) // Isolate any toast after the first one
      .forEach((t) => toast.dismiss(t.id)); // Instantly dismiss them
  }, [toasts]);

  return (
    <>
      <BrowserRouter>
        {/* 3. Keep standard top-center positioning */}
        <Toaster position="top-center" />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;