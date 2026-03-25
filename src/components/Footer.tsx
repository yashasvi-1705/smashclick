import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-center py-6 text-white/40 text-sm">
      <div className="flex justify-center gap-4 mb-2">
        <Link href="/about" className="hover:text-white/70 transition-colors">About</Link>
        <Link href="/guides" className="hover:text-white/70 transition-colors">Parent Guides</Link>
      </div>
      <p>The Busy Baby — Safe, fun, and ad-free. No tracking, no cookies.</p>
    </footer>
  );
}
