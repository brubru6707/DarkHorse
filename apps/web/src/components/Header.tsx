'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="w-[90vw] max-w-full bg-background-color text-white py-2 sm:py-4 mt-4 rounded-lg border-2 border-green-500 mx-auto">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3 bg-logo-background-green py-2 px-3 sm:px-4 rounded-md">
            <Image
              src="/images/logo.png"
              alt="DarkHorse Logo"
              width={32}
              height={32}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-white font-montserrat">
              DarkHorse
            </h1>
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/"
              className="px-4 sm:px-6 py-2 text-white hover:text-primary font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/details"
              className="details-button"
            >
              Details
            </Link>
            <Link
              href="/scan"
              className="scan-button"
            >
              Scan
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}