import { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`app ${theme}`}>
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogin={() => alert("Login")}
        onSignup={() => alert("Signup")}
      />

      <main style={{ padding: "40px" }}>
        <h1>FoundIT</h1>
        <p>Lost & Found platform</p>
      </main>
    </div>
  );
}

export default App;
