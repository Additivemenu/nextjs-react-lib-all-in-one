import React, { useMemo } from "react";
// import { createResource } from "../lib/resource";
import { fetchComments } from "../lib/api";

interface CommentsProps {
  postId: number;
}

export const Comments: React.FC<CommentsProps> = ({ postId }) => {
  return <>comments</>;
  // Use useMemo to ensure the resource is recreated when postId changes
  // const commentsResource = useMemo(() => {
  //   return createResource(fetchComments(postId));
  // }, [postId]);
  // const comments = commentsResource.read();

  // return (
  //   <div className="text-sm">
  //     <details className="cursor-pointer">
  //       <summary className="text-blue-600 hover:text-blue-800">
  //         {comments.length} comments
  //       </summary>
  //       <div className="mt-2 space-y-1 pl-4 border-l-2 border-gray-200">
  //         {comments.map((comment) => (
  //           <div key={comment.id} className="text-gray-600">
  //             <span className="font-medium">{comment.author}:</span>{" "}
  //             {comment.text}
  //           </div>
  //         ))}
  //       </div>
  //     </details>
  //   </div>
  // );
};
