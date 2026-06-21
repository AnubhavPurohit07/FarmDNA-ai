import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./components/ui";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Archive from "./pages/Archive";
import About from "./pages/About";
import UIShowcase from "./pages/UIShowcase";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider />
      <div className="min-h-screen flex flex-col bg-(--color-canvas) transition-colors">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/about" element={<About />} />
            <Route path="/showcase" element={<UIShowcase />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
