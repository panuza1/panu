import {test} from "./Blogpost/test.jsx";

export const BlogDetail = ({ setCurrentPage, post }) => {
    if (!post) return null; // safety check

    if (post.id === 1) {
        const TestComponent = test;
        return <TestComponent setCurrentPage={setCurrentPage} />;
    }
    return (
        <div className="max-w-3xl mx-auto py-16 px-4">
            <button
                onClick={() => setCurrentPage({ page: "home", post: null })}
                className="text-blue-400 hover:underline mb-6"
            >
                ← Back
            </button>

        </div>
    );
};
