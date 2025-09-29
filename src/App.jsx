import {LoadingScreen} from "./components/LoadingScreen.jsx";
import "./index.css"
import {useState} from "react";
import { Navbar } from "./components/Navbar.jsx";
import {MobileMenu} from "./components/MobileMenu.jsx";
import {Home} from "./components/sections/Home.jsx";
import {Projects} from "./components/sections/Projects.jsx";
import {About} from "./components/sections/About.jsx";
import { Blog } from "./components/sections/Blog.jsx";
import { BlogDetail } from "./components/sections/BlogDetail.jsx";

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState({ page: "home", post: null });

    return (
        <>
            <div
                className={`min-h-screen transition-opacity duration-700 bg-black text-gray-100`}
            >
                <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

                {currentPage.page === "home" && (
                    <>
                        <Home />
                        <About />
                        <Projects />
                        <Blog setCurrentPage={setCurrentPage} />
                    </>
                )}

                {currentPage.page === "blogDetail" && (
                    <BlogDetail setCurrentPage={setCurrentPage} post={currentPage.post} />
                )}
            </div>
        </>
    );
}

export default App;