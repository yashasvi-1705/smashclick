import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-8"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          About SmashPlay
        </h1>

        <div className="space-y-6 text-white/70 text-lg leading-relaxed">
          <p>
            SmashPlay is a free, ad-free interactive toy platform designed for babies and toddlers.
            Every keyboard press, mouse click, and screen touch triggers delightful animations and sounds.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Why SmashPlay?</h2>
          <p>
            Babies love pressing buttons. SmashPlay turns that natural curiosity into a magical experience
            with colorful particles, fun sounds, and 10 unique games to explore.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Privacy First</h2>
          <p>
            Zero tracking. Zero cookies. Zero accounts. Zero ads. Everything runs in your browser.
            No data leaves your device. Ever.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Parent Controls</h2>
          <p>
            Hold the top-left corner for 2 seconds or type &quot;parent&quot; to open the settings panel.
            Control volume, reduce motion, and more.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
