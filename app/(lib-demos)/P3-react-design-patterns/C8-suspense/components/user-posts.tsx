import { useMemo } from "react";
import { wrapPromise } from "../lib/resource";
import { fetchPosts } from "../lib/api";
import { Post } from "../types";

interface UserPostsProps {
  userId: number;
}

export function UserPosts({ userId }: UserPostsProps) {
  const posts: Post[] = useMemo(() => {
    const getPosts = wrapPromise(fetchPosts(userId), `posts-${userId}`);
    return getPosts();
  }, [userId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">{post.title}</h4>
            <p className="text-gray-600 text-sm mt-1">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
