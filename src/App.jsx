import './App.css';
import {LoadingScreen} from "./components/LoadingScreen.jsx";
import "./index.css"
import {useState} from "react";
import { Navbar } from "./components/Navbar.jsx";
import {MobileMenu} from "./components/MobileMenu.jsx";
import {Home} from "./components/sections/Home.jsx";
import {Projects} from "./components/sections/Projects.jsx";
import {About} from "./components/sections/About.jsx";

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            {!isLoading && <LoadingScreen onComplete={() => setIsLoading(true)} />}{" "}
            <div className={`min-h-screen transition-opacity duration-700 ${
                isLoading ? "opacity-100" : "opacity-0"} bg-black text-gray-100`}
            >
                <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <Home />
                <About />
                <Projects />
            </div>
        </>
    );
}

export default App
