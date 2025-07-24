"use client";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
}

const AsyncHooksDemo: React.FC = () => {
  const [userId, setUserId] = useState<number>(1);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ! watch this for how many times it renders
  const renderCount = useRef<number>(0);
  renderCount.current++;
  console.log("Render count:", renderCount.current);

  // Memoized async function to fetch user -> the 1st argument is not an async function, but returns an async function
  const fetchUser = useMemo(
    () =>
      async (id: number): Promise<User> => {
        console.log("Fetching user...");
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${id}`,
        );
        if (!response.ok) throw new Error("Failed to fetch user");
        return response.json();
      },
    [],
  );

  // Memoized async function to fetch posts
  const fetchPosts = useMemo(
    () =>
      async (id: number): Promise<Post[]> => {
        console.log("Fetching posts...");
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${id}`,
        );
        if (!response.ok) throw new Error("Failed to fetch posts");
        return response.json();
      },
    [],
  );

  // Callback to load user and posts -> note 1st argument is an async function (identical to useMemo 1st arg returns an async function)
  const loadUserAndPosts = useCallback(async () => {
    console.log("start to load user and posts");
    setIsLoading(true);
    try {
      const userData = await fetchUser(userId);
      setUser(userData);
      const postsData = await fetchPosts(userId);
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      console.log("end to load user and posts");
      setIsLoading(false);
    }
  }, [userId, fetchUser, fetchPosts]);

  // Effect to trigger loading when userId changes
  useEffect(() => {
    loadUserAndPosts();
  }, [loadUserAndPosts]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Async Hooks Demo</h1>
      <div className="mb-4">
        <label htmlFor="userId" className="block mb-2">
          User ID:
        </label>
        <input
          id="userId"
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          {user && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">User Info</h2>
              <p>Name: {user.name}</p>
            </div>
          )}
          {posts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">User Posts</h2>
              <ul className="list-disc pl-5">
                {posts.map((post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AsyncHooksDemo;
