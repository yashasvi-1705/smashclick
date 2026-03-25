import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'The Busy Baby — Where Little Fingers Make Big Magic!',
  description: 'A fullscreen interactive toy platform for babies and toddlers. Every keyboard press, mouse click, and touch triggers fun animations and sounds. 10 delightful games, zero ads, zero tracking.',
  keywords: ['baby game', 'toddler game', 'keyboard smash', 'kids interactive', 'baby toy', 'educational game'],
  openGraph: {
    title: 'The Busy Baby — Where Little Fingers Make Big Magic!',
    description: '10 interactive games for babies and toddlers. Colorful animations, fun sounds, completely free and ad-free.',
    type: 'website',
    siteName: 'The Busy Baby',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-gray-900"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
