import { User, Post, Comment } from "../types";

// Simulate async data fetching
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const fetchUserData = async (userId: number): Promise<User> => {
  console.log(`🌐 fetchUserData called for userId: ${userId}`);
  await delay(2000); // Simulate network delay
  const user = {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
    avatar: `https://i.pravatar.cc/150?img=${userId}`,
  };
  console.log(`✅ fetchUserData completed for userId: ${userId}`, user);
  return user;
};

export const fetchPosts = async (userId: number): Promise<Post[]> => {
  await delay(1500); // Different delay for posts
  return Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1} by User ${userId}`,
    content: `This is the content of post ${
      i + 1
    }. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    likes: Math.floor(Math.random() * 100),
  }));
};

export const fetchComments = async (postId: number): Promise<Comment[]> => {
  await delay(1000);
  return Array.from({ length: 2 }, (_, i) => ({
    id: i + 1,
    author: `Commenter ${i + 1}`,
    text: `Great post! This is comment ${i + 1} on post ${postId}.`,
  }));
};
