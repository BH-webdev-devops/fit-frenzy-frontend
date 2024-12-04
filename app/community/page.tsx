import React from 'react';

// Define a type for the blog post
type BlogPost = {
    id: number;
    user: string;
    title: string;
    content: string;
};

// Mock list of blog posts
const blogPosts: BlogPost[] = [
    { id: 1, user: 'Alice', title: 'First Post', content: 'This is the first post.' },
    { id: 2, user: 'Bob', title: 'Second Post', content: 'This is the second post.' },
    { id: 3, user: 'Charlie', title: 'Third Post', content: 'This is the third post.' },
];

// Functional component to display the list of posts in a table
const BlogPage: React.FC = () => {
    return (
        <div>
            <h1>Community Blog</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>User</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Title</th>
                        <th style={{ border: '1px solid #ccc', padding: '10px' }}>Content</th>
                    </tr>
                </thead>
                <tbody>
                    {blogPosts.map(post => (
                        <tr key={post.id}>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{post.user}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{post.title}</td>
                            <td style={{ border: '1px solid #ccc', padding: '10px' }}>{post.content}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Render the component
export default BlogPage;