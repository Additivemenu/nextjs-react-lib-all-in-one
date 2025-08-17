import { useState, useEffect } from "react";
import Image from "next/image";
import { User } from "../types";

interface LazyUserProfileProps {
  userId: number;
}

// Simulate fetching user data
const fetchUserData = async (userId: number): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    avatar: `https://i.pravatar.cc/150?img=${userId}`,
  };
};

export default function LazyUserProfile({ userId }: LazyUserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchUserData(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-48" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <Image
          src={user.avatar}
          alt={`${user.name}'s avatar`}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
          <p className="text-xs text-green-600 mt-1">
            ✨ Loaded with React.lazy()
          </p>
        </div>
      </div>
    </div>
  );
}
