import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-blue-600"
      >
        <path
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 25.2c-6.188 0-11.2-5.012-11.2-11.2S9.812 4.8 16 4.8 27.2 9.812 27.2 16 22.188 27.2 16 27.2z"
          fill="currentColor"
        />
        <path
          d="M16 7.6c-4.636 0-8.4 3.764-8.4 8.4s3.764 8.4 8.4 8.4 8.4-3.764 8.4-8.4-3.764-8.4-8.4-8.4zm0 14c-3.092 0-5.6-2.508-5.6-5.6s2.508-5.6 5.6-5.6 5.6 2.508 5.6 5.6-2.508 5.6-5.6 5.6z"
          fill="currentColor"
        />
        <path
          d="M16 12.8c-1.768 0-3.2 1.432-3.2 3.2s1.432 3.2 3.2 3.2 3.2-1.432 3.2-3.2-1.432-3.2-3.2-3.2z"
          fill="currentColor"
        />
      </svg>
      <span className="text-xl font-bold text-gray-900">Arv.ing</span>
    </div>
  );
}
