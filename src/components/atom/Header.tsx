// components/Header.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="bg-white shadow px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo or Title */}
        <Link href="/" className="text-xl font-semibold text-gray-900">
          World Explorer
        </Link>

        {/* Search bar */}
        <div className="hidden sm:flex flex-1 mx-4 relative">
          <input
            type="text"
            placeholder="Search countries..."
            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* User profile icon */}
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <UserCircleIcon className="w-8 h-8 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;