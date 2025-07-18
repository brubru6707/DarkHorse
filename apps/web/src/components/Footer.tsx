'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0d120d] border-t border-[#008000] py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-white mb-4 md:mb-0">
            <p className="text-sm">
              © 2024 DarkHorse. All rights reserved.
            </p>
          </div>
          <div className="text-white">
            <p className="text-sm">
              Need help? Contact us at:{' '}
              <a 
                href="mailto:info@darkhorse.bruno-rodriguez-mendez.com"
                className="text-[#00cc00] hover:text-[#008000] transition-colors duration-200 underline"
              >
                info@darkhorse.bruno-rodriguez-mendez.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}