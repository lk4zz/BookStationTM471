import Styles from "./App.module.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/home";
import BookDetailsPage from "./pages/bookdetails/BookDetailsPage"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;