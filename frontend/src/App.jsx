import { useState } from "react";

import Navbar from "./components/Navbar";

import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import Landing from "./components/Landing";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const closeAll = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <div className={`app ${theme}`}>

      {/* BACKGROUND (BLURRED WHEN MODAL OPEN) */}
      <div className={`app-content ${(showLogin || showSignup) ? "blurred" : ""}`}>
        <Navbar
          theme={theme}
          onToggleTheme={() =>
            setTheme(prev => (prev === "light" ? "dark" : "light"))
          }
          onLogin={openLogin}
          onSignup={openSignup}
        />

        
        <Landing theme={theme} />

        <Footer />
      </div>

      {/* MODALS (OUTSIDE BLUR) */}
      {showSignup && (
        <SignupModal
          theme={theme}
          onClose={closeAll}
          forceLogin={openLogin}
           switchToLogin={() => {
      setShowSignup(false);
      setShowLogin(true);
    }}
        />
      )}

      {showLogin && (
        <LoginModal
          theme={theme}
         onClose={() => setShowLogin(false)}
    switchToSignup={() => {
      setShowLogin(false);
      setShowSignup(true);
    }}
  />
      )}

    </div>
  );
}

export default App;
