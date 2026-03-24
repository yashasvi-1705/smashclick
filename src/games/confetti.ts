import { GameEngine } from './types';
import { ParticleSystem } from '@/engine/ParticleSystem';
import { COLORS, SCALES } from '@/lib/constants';
import { rand, pick } from '@/lib/utils';

export class ConfettiGame implements GameEngine {
  id = 'confetti';
  name = 'Confetti Blast';
  emoji = '🎉';
  description = 'Explosions of colorful confetti!';
  backgroundColor = '#1a1a2e';
  colors = COLORS.rainbow;
  musicScale = SCALES.cMajor;
  waveform: OscillatorType = 'triangle';

  private particles = new ParticleSystem();
  private w = 0;
  private h = 0;

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  onInteraction(x: number, y: number) {
    const count = 30 + Math.floor(Math.random() * 20);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(100, 500);
      this.particles.emit({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100,
        size: rand(4, 10),
        sizeEnd: rand(2, 5),
        color: pick(this.colors),
        alpha: 1,
        alphaEnd: 0,
        life: rand(1.5, 3),
        type: 'rect',
        gravity: 400,
        friction: 0.98,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: rand(-10, 10),
      });
    }
  }

  onPointerMove(x: number, y: number) {
    if (Math.random() < 0.3) {
      this.particles.emit({
        x,
        y,
        vx: rand(-30, 30),
        vy: rand(-50, -10),
        size: rand(3, 6),
        color: pick(this.colors),
        alpha: 0.7,
        alphaEnd: 0,
        life: rand(0.5, 1),
        type: 'rect',
        gravity: 200,
        rotation: Math.random() * Math.PI,
        rotationSpeed: rand(-5, 5),
      });
    }
  }

  update(dt: number) {
    this.particles.update(dt);
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.draw(ctx);
  }

  destroy() {
    this.particles.clear();
  }
}
