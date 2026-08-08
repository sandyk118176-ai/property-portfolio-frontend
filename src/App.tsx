import { useState, useEffect } from "react";
import { Moon, Sun, Building2 } from "lucide-react";
import PropertyList from "./components/PropertyList";
import "./App.css";
import PortfolioSummaryCards from "./components/PortfolioSummaryCards";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>
          <Building2 size={26} style={{ verticalAlign: "middle", marginRight: "8px"}} />
          Property Portfolio Tracker
        </h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>
      <PortfolioSummaryCards/>
      <PropertyList />
    </div>
  );
}

export default App;
