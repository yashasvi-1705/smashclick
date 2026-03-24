import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function GuidesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-8"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Parent Guides
        </h1>

        <div className="space-y-8 text-white/70 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Pick a game from the home page</li>
              <li>The game will try to go fullscreen automatically</li>
              <li>Let your little one press keys, tap the screen, or click anywhere</li>
              <li>Every interaction creates fun animations and sounds!</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Accessing Parent Settings</h2>
            <p>There are two ways to open the parent settings panel:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>Hold gesture:</strong> Press and hold the top-left corner of the screen for 2 seconds</li>
              <li><strong>Keyboard:</strong> Type the word &quot;parent&quot; on the keyboard</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Available Settings</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Sound on/off</strong> — Mute all sounds</li>
              <li><strong>Volume</strong> — Adjust how loud the sounds are</li>
              <li><strong>Mouse Sparkle</strong> — Toggle sparkle trail on mouse/finger movement</li>
              <li><strong>Reduce Motion</strong> — Fewer particles, slower animations</li>
              <li><strong>Emoji Mode</strong> — Show emojis instead of letters when keys are pressed</li>
              <li><strong>Particle Intensity</strong> — Control how many particles appear (1-5)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Tips</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Use fullscreen mode for the best experience — it prevents accidental navigation</li>
              <li>Start with the Confetti or Bubble game for younger babies</li>
              <li>The Drum Kit game is great for older toddlers learning cause-and-effect</li>
              <li>Finger Paint is perfect for tablets and touchscreens</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
