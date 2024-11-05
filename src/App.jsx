// App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Login from "./components/LogIn";
import SignUp from "./components/SignUp";
import Test from "./components/Test";
import WordBuilder from "./components/WordBuilder";

const App = () => {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      <Routes>
        <Route path="/Hands-AI" element={<Hero />} />
        <Route path="/Hands-AI/login" element={<Login />} />
        <Route path="/Hands-AI/signup" element={<SignUp />} />
        <Route path="/Hands-AI/test" element={<Test />} />
        <Route path="/Hands-AI/word-builder" element={<WordBuilder />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
