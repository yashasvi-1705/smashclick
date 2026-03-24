import { GameEngine } from './types';
import { ParticleSystem } from '@/engine/ParticleSystem';
import { COLORS, SCALES } from '@/lib/constants';
import { rand, pick } from '@/lib/utils';

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  phase: number;
  speed: number;
}

export class SpaceGame implements GameEngine {
  id = 'space';
  name = 'Space Explorer';
  emoji = '🪐';
  description = 'Stars, comets, and galaxies!';
  backgroundColor = '#0b0b1a';
  colors = COLORS.night;
  musicScale = SCALES.aMinorPentatonic;
  waveform: OscillatorType = 'sawtooth';

  private particles = new ParticleSystem();
  private stars: Star[] = [];
  private w = 0;
  private h = 0;
  private time = 0;

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
    this.stars = [];
    for (let i = 0; i < 250; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: rand(0.5, 2.5),
        baseAlpha: rand(0.3, 1),
        phase: Math.random() * Math.PI * 2,
        speed: rand(1, 4),
      });
    }
  }

  onInteraction(x: number, y: number, key?: string) {
    const count = 20 + Math.floor(Math.random() * 15);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(80, 300);
      this.particles.emit({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(3, 8),
        sizeEnd: 0,
        color: pick(this.colors),
        alpha: 1,
        alphaEnd: 0,
        life: rand(1, 2.5),
        type: 'star',
        friction: 0.97,
        rotationSpeed: rand(-3, 3),
        composite: 'lighter',
      });
    }

    // Comet trail on spacebar or random chance
    if (key === ' ' || Math.random() < 0.2) {
      const cometAngle = rand(-Math.PI * 0.8, -Math.PI * 0.2);
      const cometSpeed = rand(400, 700);
      for (let i = 0; i < 30; i++) {
        this.particles.emit({
          x: x + rand(-5, 5),
          y: y + rand(-5, 5),
          vx: Math.cos(cometAngle) * cometSpeed * rand(0.3, 1),
          vy: Math.sin(cometAngle) * cometSpeed * rand(0.3, 1),
          size: rand(2, 5),
          sizeEnd: 0,
          color: '#FFD700',
          alpha: rand(0.5, 1),
          alphaEnd: 0,
          life: rand(0.5, 1.5),
          type: 'circle',
          friction: 0.95,
          composite: 'lighter',
        });
      }
    }
  }

  onPointerMove(x: number, y: number) {
    if (Math.random() < 0.3) {
      this.particles.emit({
        x, y,
        vx: rand(-20, 20),
        vy: rand(-20, 20),
        size: rand(1, 3),
        color: pick(['#FFD700', '#FFA500', '#87CEEB']),
        alpha: 0.8,
        alphaEnd: 0,
        life: rand(0.3, 0.8),
        type: 'circle',
        composite: 'lighter',
      });
    }
  }

  update(dt: number) {
    this.time += dt;
    this.particles.update(dt);
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.w, this.h);

    // Twinkling stars
    for (const s of this.stars) {
      const alpha = s.baseAlpha * (0.5 + 0.5 * Math.sin(this.time * s.speed + s.phase));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.draw(ctx);
  }

  destroy() {
    this.particles.clear();
  }
}
