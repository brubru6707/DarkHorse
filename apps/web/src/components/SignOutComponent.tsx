"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function SignOutComponent() {
  return (
    <SignOutButton>
      {/* Add cursor-pointer to your button's className */}
      <button className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">
        Log Out
      </button>
    </SignOutButton>
  );
}