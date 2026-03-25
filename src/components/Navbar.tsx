'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm">
      <Link href="/" className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">
        The Busy Baby
      </Link>
      <div className="flex gap-4">
        <Link href="/about" className="text-white/70 hover:text-white text-sm transition-colors">About</Link>
        <Link href="/guides" className="text-white/70 hover:text-white text-sm transition-colors">Guides</Link>
      </div>
    </nav>
  );
}
