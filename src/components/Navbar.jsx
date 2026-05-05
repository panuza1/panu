import React, { useEffect } from "react";

export const Navbar = ({ menuOpen, setMenuOpen, setCurrentPage }) => {
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
    }, [menuOpen]);

    const handleSectionClick = (page) => {
        if (!setCurrentPage) return;
        setCurrentPage({ page, post: null });
    };

    return (
        <nav className="fixed top-0 w-full z-99 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <a
                        href="#home"
                        className="font-mono text-xl font-bold text-white"
                        onClick={() => handleSectionClick("home")}
                    >
                        Panupong<span className="text-green-500">.chai</span>
                    </a>

                    {/* Hamburger for mobile */}
                    <div
                        className="w-7 h-5 relative cursor-pointer z-40 md:hidden"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        &#9776;
                    </div>

                    <div className="hidden sm:flex items-center space-x-8">
                        <a
                            href="#home"
                            className="text-gray-300 hover:text-white transition-colors"
                            onClick={() => handleSectionClick("home")}
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            className="text-gray-300 hover:text-white transition-colors"
                            onClick={() => handleSectionClick("home")}
                        >
                            About
                        </a>
                        <a
                            href="#projects"
                            className="text-gray-300 hover:text-white transition-colors"
                            onClick={() => handleSectionClick("home")}
                        >
                            Project
                        </a>
                        <a
                            href="#vibe-check"
                            className="text-gray-300 hover:text-white transition-colors"
                            onClick={() => handleSectionClick("vibe")}
                        >
                            Vibe
                        </a>
                        <a
                            href="#blog"
                            className="text-gray-300 hover:text-white transition-colors"
                            onClick={() => handleSectionClick("home")}
                        >
                            Blog
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};
