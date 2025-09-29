import {test} from "./Blogpost/test.jsx";

const blogPosts = [
    {
        id: 1,
        title: "Why I Stopped Using Classes in Python",
        excerpt: "After years of writing class-based Python code, I realized simpler tools often get the job done better...",
        content: "There was a day when I enclosed everything in classes. It seemed the 'professional' thing to do..."
    },
    {
        id: 2,
        title: "Understanding JavaScript Closures",
        excerpt: "Closures are a fundamental concept in JavaScript that allow functions to access variables from an outer scope...",
        content: "Closures let you maintain private variables and create more modular code..."
    }
    // เพิ่ม post ใหม่ได้เรื่อย ๆ
];

export const Blog = ({ setCurrentPage }) => {
    return (
        <section id="blog" className="py-16 bg-gray-900">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">Blog</h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
                {blogPosts.map((post) => (
                    <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-400 mb-4">{post.excerpt}</p>
                        <button
                            onClick={() => setCurrentPage({ page: "blogDetail", post})}
                            className="text-blue-400 hover:underline"
                        >
                            Read More →
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};
