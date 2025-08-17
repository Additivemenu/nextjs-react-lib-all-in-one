import { useState, useEffect } from "react";
import { Post } from "../types";

interface LazyUserPostsProps {
  userId: number;
}

// Simulate fetching posts data
const fetchPosts = async (userId: number): Promise<Post[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1} by User ${userId}`,
    content: `This is the content of post ${
      i + 1
    }. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    likes: Math.floor(Math.random() * 100),
  }));
};

export default function LazyUserPosts({ userId }: LazyUserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPosts(userId)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-l-4 border-gray-200 pl-4">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-48 mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">{post.title}</h4>
            <p className="text-gray-600 text-sm mt-1">{post.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                ❤️ {post.likes} likes
              </span>
              <span className="text-xs text-green-600">
                ✨ Loaded with React.lazy()
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
