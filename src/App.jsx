// App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Login from "./components/LogIn";
import SignUp from "./components/SignUp";
import Test from "./components/Test";
import WordBuilder from "./components/WordBuilder";
<<<<<<< HEAD
import UserProfile from "./components/UserProfile";
import Badges from "./components/Badges";
=======
import Badges from "./components/Badges";
import UserProfile from "./components/UserProfile";
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc

const App = () => {
  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
      <Header />
      <Routes>
        <Route path="/Hands-AI" element={<Hero />} />
        <Route path="/Hands-AI/login" element={<Login />} />
        <Route path="/Hands-AI/signup" element={<SignUp />} />
<<<<<<< HEAD
        <Route path="/Hands-AI/test" element={<Test />} />
        <Route path="/Hands-AI/word-builder" element={<WordBuilder />} />
        <Route path="/Hands-AI/profile" element={<UserProfile />} />
        <Route path="/Hands-AI/badges" element={<Badges />} />
=======
        <Route path="/Hands-AI/simon-dice" element={<Test />} />
        <Route path="/Hands-AI/word-builder" element={<WordBuilder />} />
        <Route path="/Hands-AI/badges" element={<Badges />} />
        <Route path="/Hands-AI/profile" element={<UserProfile />} />
>>>>>>> 4b03dc711399729500d3a74132a18a9870d287cc
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
