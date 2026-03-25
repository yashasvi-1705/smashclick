import Navbar from '@/components/Navbar';
import GameSelector from '@/components/GameSelector';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="text-center py-12 md:py-20 px-4">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-4"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            The Busy Baby
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-xl mx-auto">
            Where little fingers make big magic!
          </p>
          <p className="text-sm text-white/30 mt-2">
            Tap, press, or smash — every touch creates something beautiful
          </p>
        </div>

        {/* Game Grid */}
        <GameSelector />
      </main>

      <Footer />
    </div>
  );
}
