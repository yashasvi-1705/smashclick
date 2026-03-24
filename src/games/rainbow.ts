import { GameEngine } from './types';
import { ParticleSystem } from '@/engine/ParticleSystem';
import { SCALES } from '@/lib/constants';
import { rand } from '@/lib/utils';

interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

const RAINBOW = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

export class RainbowGame implements GameEngine {
  id = 'rainbow';
  name = 'Rainbow Trail';
  emoji = '🌈';
  description = 'Draw rainbows across the sky!';
  backgroundColor = '#FFF0F5';
  colors = RAINBOW;
  musicScale = SCALES.cMajor;
  waveform: OscillatorType = 'sine';

  private particles = new ParticleSystem();
  private trails: TrailPoint[][] = [[]];
  private w = 0;
  private h = 0;
  private time = 0;
  private noteIndex = 0;

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  onInteraction(x: number, y: number) {
    // Rainbow explosion — concentric rings
    for (let r = 0; r < RAINBOW.length; r++) {
      const radius = 30 + r * 20;
      const count = 20;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        this.particles.emit({
          x: x + Math.cos(angle) * radius * 0.3,
          y: y + Math.sin(angle) * radius * 0.3,
          vx: Math.cos(angle) * radius * 2,
          vy: Math.sin(angle) * radius * 2,
          size: rand(3, 6),
          sizeEnd: 0,
          color: RAINBOW[r],
          alpha: 0.8,
          alphaEnd: 0,
          life: rand(0.8, 1.5),
          type: 'circle',
          friction: 0.95,
        });
      }
    }
    this.noteIndex++;
  }

  onPointerMove(x: number, y: number) {
    const current = this.trails[this.trails.length - 1];
    current.push({ x, y, age: 0 });
    if (current.length > 200) current.shift();

    // Sparkle particles along trail
    if (Math.random() < 0.4) {
      this.particles.emit({
        x: x + rand(-10, 10),
        y: y + rand(-10, 10),
        size: rand(2, 5),
        sizeEnd: 0,
        color: RAINBOW[Math.floor(Math.random() * RAINBOW.length)],
        alpha: 1,
        alphaEnd: 0,
        life: rand(0.3, 0.8),
        type: 'star',
        rotationSpeed: rand(-5, 5),
      });
    }
  }

  update(dt: number) {
    this.time += dt;
    this.particles.update(dt);

    // Age trail points and remove old ones
    for (const trail of this.trails) {
      for (const p of trail) {
        p.age += dt;
      }
      // Remove points older than 4 seconds
      while (trail.length > 0 && trail[0].age > 4) {
        trail.shift();
      }
    }
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    const grd = ctx.createLinearGradient(0, 0, 0, this.h);
    grd.addColorStop(0, '#FFF0F5');
    grd.addColorStop(0.5, '#F0F0FF');
    grd.addColorStop(1, '#F5FFFA');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw rainbow trails
    for (const trail of this.trails) {
      if (trail.length < 2) continue;

      for (let c = 0; c < RAINBOW.length; c++) {
        const offset = (c - 3) * 6;
        ctx.strokeStyle = RAINBOW[c];
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();

        for (let i = 0; i < trail.length; i++) {
          const p = trail[i];
          const alpha = Math.max(0, 1 - p.age / 4);
          ctx.globalAlpha = alpha * 0.7;
          const px = p.x;
          const py = p.y + offset;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    this.particles.draw(ctx);
  }

  destroy() {
    this.particles.clear();
    this.trails = [[]];
  }
}
