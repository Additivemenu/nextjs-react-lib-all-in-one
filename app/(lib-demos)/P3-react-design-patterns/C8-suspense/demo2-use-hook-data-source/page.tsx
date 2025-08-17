"use client";

import PageToolbar from "@/app/_components/toolbars/page-toolbar";
import { use, useState, Suspense, startTransition, ReactNode } from "react";
import { readmePath } from "./readme-path";

// 用户数据类型定义
interface UserData {
  id: number;
  name: string;
  email: string;
  bio: string;
}

// API 响应类型
type ApiResponse<T> = Promise<T>;

// 模拟 API 调用
function fetchUserData(userId: number): ApiResponse<UserData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        bio: `This is the bio for user ${userId}`,
      });
    }, 1500);
  });
}

// Promise 缓存 - 使用泛型确保类型安全
class PromiseCache {
  private cache = new Map<string, Promise<any>>();

  get<T>(key: string, promiseFactory: () => Promise<T>): Promise<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, promiseFactory());
    }
    return this.cache.get(key) as Promise<T>;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

// 创建缓存实例
const promiseCache = new PromiseCache();

// 获取缓存的用户数据 Promise
function getCachedUserData(userId: number): Promise<UserData> {
  return promiseCache.get(`user-${userId}`, () => fetchUserData(userId));
}

// 用户资料组件的 Props 类型
interface UserProfileProps {
  userId: number;
}

// 使用 use Hook 的组件
function UserProfile({ userId }: UserProfileProps): JSX.Element {
  // use Hook 读取缓存的 Promise，TypeScript 自动推断类型为 UserData
  const userData: UserData = use(getCachedUserData(userId));

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{userData.name}</h2>
      <p className="text-gray-600 mb-2">{userData.email}</p>
      <p className="text-gray-700">{userData.bio}</p>
      <div className="mt-4 text-sm text-gray-500">User ID: {userData.id}</div>
    </div>
  );
}

// 错误边界组件的 Props 类型
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

// 错误边界组件
function ErrorBoundary({
  children,
  fallback,
}: ErrorBoundaryProps): JSX.Element {
  const [hasError, setHasError] = useState<boolean>(false);

  if (hasError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {fallback}
      </div>
    );
  }

  // 简化的错误捕获，实际应用中使用 componentDidCatch 或 ErrorBoundary 库
  try {
    return <>{children}</>;
  } catch (error: unknown) {
    // 类型守卫：检查是否是 Promise
    if (error instanceof Promise) {
      throw error; // 让 Suspense 处理
    }

    // 处理其他类型的错误
    console.error("ErrorBoundary caught an error:", error);
    setHasError(true);
    return <></>;
  }
}

// 加载指示器组件
function LoadingSpinner(): JSX.Element {
  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">正在加载用户资料...</p>
    </div>
  );
}

// 用户选择按钮的 Props 类型
interface UserButtonProps {
  userId: number;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: (userId: number) => void;
}

// 用户选择按钮组件
function UserButton({
  userId,
  isSelected,
  isDisabled,
  onClick,
}: UserButtonProps): JSX.Element {
  return (
    <button
      onClick={() => onClick(userId)}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-md transition-colors ${
        isSelected
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      用户 {userId}
    </button>
  );
}

// 代码示例组件
function CodeExample(): JSX.Element {
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-2">
        TypeScript 关键代码：
      </h3>
      <pre className="text-sm text-gray-700 overflow-x-auto">
        {`// 1. 类型定义
interface UserData {
  id: number;
  name: string;
  email: string;
  bio: string;
}

// 2. 类型安全的缓存类
class PromiseCache {
  private cache = new Map<string, Promise<any>>();

  get<T>(key: string, promiseFactory: () => Promise<T>): Promise<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, promiseFactory());
    }
    return this.cache.get(key) as Promise<T>;
  }
}

// 3. 类型安全的组件
function UserProfile({ userId }: { userId: number }) {
  const userData: UserData = use(getCachedUserData(userId));
  return <div>{userData.name}</div>;
}`}
      </pre>
    </div>
  );
}

// 主应用组件
export default function App(): JSX.Element {
  const [selectedUser, setSelectedUser] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUserChange = (userId: number): void => {
    setIsLoading(true);
    startTransition(() => {
      setSelectedUser(userId);
      setIsLoading(false);
    });
  };

  // 清除缓存的函数
  const clearCache = (): void => {
    promiseCache.clear();
    // 强制重新渲染以重新获取数据
    setSelectedUser((prev) => prev);
  };

  const userIds: number[] = [1, 2, 3, 4];

  return (
    <div className="h-full bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <PageToolbar readmePath={readmePath} />
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          React use Hook + Suspense Demo (TypeScript)
        </h1>

        {/* 用户选择器 */}
        <div className="mb-6 text-center">
          <p className="mb-4 text-gray-600">选择用户查看资料:</p>
          <div className="space-x-4 mb-4">
            {userIds.map((userId: number) => (
              <UserButton
                key={userId}
                userId={userId}
                isSelected={selectedUser === userId}
                isDisabled={isLoading}
                onClick={handleUserChange}
              />
            ))}
          </div>
          <button
            onClick={clearCache}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            清除缓存
          </button>
        </div>

        {/* 说明文档 */}
        <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">工作原理：</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>
              • <code>use</code> Hook 读取缓存的 Promise
            </li>
            <li>• 如果 Promise pending，会抛出给 Suspense</li>
            <li>• Suspense 显示 fallback UI</li>
            <li>• Promise resolve 后，组件重新渲染显示数据</li>
            <li>• 缓存确保相同请求不会重复发起</li>
          </ul>
        </div>

        {/* 核心演示区域 */}
        <ErrorBoundary fallback="加载用户数据时出错了！">
          {/*! Suspense catches the promise thrown by UserProfile! */}
          <Suspense fallback={<LoadingSpinner />}>
            <UserProfile userId={selectedUser} />
          </Suspense>
        </ErrorBoundary>

        {/* <CodeExample /> */}
      </div>
    </div>
  );
}
