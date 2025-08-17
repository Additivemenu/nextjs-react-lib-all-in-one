export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  likes: number;
}

export interface Comment {
  id: number;
  author: string;
  text: string;
}

export interface Resource<T> {
  read(): T;
}
