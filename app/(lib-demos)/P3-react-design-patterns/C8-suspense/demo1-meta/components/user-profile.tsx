import { useMemo } from "react";
import Image from "next/image";
// import { wrapPromise } from "../lib/resource";
import { fetchUserData } from "../lib/api";
import { User } from "../types";

interface UserProfileProps {
  userId: number;
}

export function UserProfile({ userId }: UserProfileProps) {
  return <>user profile</>;
  // const user: User = useMemo(() => {
  //   const getUserData = wrapPromise(fetchUserData(userId), `user-${userId}`);
  //   return getUserData();
  // }, [userId]);

  // return (
  //   <div className="bg-white p-6 rounded-lg shadow-md">
  //     <div className="flex items-center space-x-4">
  //       <Image
  //         src={user.avatar}
  //         alt={`${user.name}'s avatar`}
  //         width={80}
  //         height={80}
  //         className="rounded-full"
  //       />
  //       <div>
  //         <h3 className="text-xl font-semibold">{user.name}</h3>
  //         <p className="text-gray-600">{user.email}</p>
  //         <p className="text-sm text-gray-500">ID: {user.id}</p>
  //       </div>
  //     </div>
  //   </div>
  // );
}
