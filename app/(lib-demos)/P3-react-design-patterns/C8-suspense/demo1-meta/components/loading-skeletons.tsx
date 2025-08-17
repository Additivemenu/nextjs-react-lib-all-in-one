export const LoadingSkeletons = {
  UserProfile: () => (
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
  ),

  UserPosts: () => (
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
  ),
};

// Keep the old exports for backward compatibility
export const UserProfileSkeleton = LoadingSkeletons.UserProfile;
export const PostSkeleton = LoadingSkeletons.UserPosts;
export const LazyLoadingSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p>Loading lazy component...</p>
  </div>
);
