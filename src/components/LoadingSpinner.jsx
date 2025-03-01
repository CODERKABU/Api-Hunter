import React from "react";

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="w-10 h-10 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-blue-500"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;