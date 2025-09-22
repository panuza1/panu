export const About = () => {
    return <section id="about" className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400
                bg-clip-text text-transparent text-center"> {" "} About Me</h2>
            <div className="rounded-xl p-8 border-white/10 border hover:-translate-y-1 hover:border-blue-500/30
                       hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition">
                <p className="text-gray-300 mb-6">
                    Hello everyone, my name is Panupong Chaichun, and you can call me Jeng. I'm a Currently a information technology student
                    at King Mongkut's University of Technology Thonburi.
                </p>
                <div className="flex items-center justify-center py-6">
                    <a
                        href="https://github.com/panuza1"
                        className="bg-blue-500 text-white py-3 px-6 rounded font-medium transition hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] inline-block"
                    >
                        GITHUB
                    </a>
                </div>
            </div>
        </div>
    </section>
}