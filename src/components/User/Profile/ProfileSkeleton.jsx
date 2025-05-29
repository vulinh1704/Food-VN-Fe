import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="flex min-h-screen container mb-8 animate-pulse">
      {/* Sidebar Skeleton */}
      <aside className="w-64 border-r border-gray-200 p-4">
        <div className="flex items-center mb-6 gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
        <nav className="space-y-4">
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
          <ul className="pl-2 space-y-2">
            <li className="w-20 h-3 bg-gray-200 rounded"></li>
            <li className="w-20 h-3 bg-gray-200 rounded mt-2"></li>
            <li className="w-28 h-3 bg-gray-200 rounded mt-2"></li>
          </ul>
          <div className="pt-4">
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
          </div>
        </nav>
      </aside>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="w-48 h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-48 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton; 