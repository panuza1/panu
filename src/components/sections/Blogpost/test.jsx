import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export const test = ({ setCurrentPage }) => {
    return (
        <div className="max-w-3xl mx-auto py-16 px-4">
            <button
                onClick={() => setCurrentPage({ page: "home" })}
                className="text-blue-400 hover:underline mb-6"
            >
                ← Back
            </button>
            <h1 className="text-4xl font-bold mb-6 text-white">
                this is test page (Example by chatgpt )
            </h1>

            <p className="text-gray-400 mb-4">
                After years of writing class-based Python code, I realized simpler tools often get the job done better...
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
                There was a day when I enclosed everything in classes. Object-Oriented Programming (OOP) is powerful, but sometimes simple functions work better.
            </p>

            <SyntaxHighlighter language="python" style={materialDark} className="rounded-lg mb-6">
                {`def greet(name):
    return f"Hello, {name}!"

print(greet("Alice"))`}
            </SyntaxHighlighter>

            <p className="text-gray-300 leading-relaxed">
                This is how you can replace class-heavy code with simple functions.
            </p>
        </div>
    );
};
