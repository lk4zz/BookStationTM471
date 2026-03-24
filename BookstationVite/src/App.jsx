import Styles from "./App.module.css";
import './components/UI/rootvariables.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Explore from "./pages/Explore/Explore";
import BookDetailsPage from "./pages/bookdetails/BookDetailsPage"; 
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/authPages/LoginPage";
import SingupPage from "./pages/authPages/SingupPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SingupPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;