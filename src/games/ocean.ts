import { GameEngine } from './types';
import { ParticleSystem } from '@/engine/ParticleSystem';
import { COLORS, SCALES } from '@/lib/constants';
import { rand, pick } from '@/lib/utils';

interface Seaweed {
  x: number;
  height: number;
  segments: number;
  phase: number;
  color: string;
}

export class OceanGame implements GameEngine {
  id = 'ocean';
  name = 'Ocean Dive';
  emoji = '🐠';
  description = 'Swim with fish and jellyfish!';
  backgroundColor = '#0a4a5c';
  colors = COLORS.ocean;
  musicScale = SCALES.fMajor;
  waveform: OscillatorType = 'sine';

  private particles = new ParticleSystem();
  private w = 0;
  private h = 0;
  private time = 0;
  private seaweeds: Seaweed[] = [];
  private ambientTimer = 0;

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
    this.seaweeds = [];
    for (let i = 0; i < 15; i++) {
      this.seaweeds.push({
        x: rand(0, w),
        height: rand(80, 200),
        segments: Math.floor(rand(5, 12)),
        phase: Math.random() * Math.PI * 2,
        color: pick(['#2d8a4e', '#1a6b3a', '#3da860', '#256b40']),
      });
    }
  }

  onInteraction(x: number, y: number) {
    // Fish
    const fishCount = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < fishCount; i++) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      const speed = rand(60, 150);
      const fishColor = pick(this.colors);
      this.particles.emit({
        x, y: y + rand(-30, 30),
        vx: dir * speed,
        vy: rand(-20, 20),
        size: rand(12, 25),
        sizeEnd: rand(8, 15),
        color: fishColor,
        alpha: 1,
        alphaEnd: 0.2,
        life: rand(3, 6),
        type: 'circle',
        friction: 0.995,
        drawFn: (ctx, p) => {
          const d = p.vx > 0 ? 1 : -1;
          const wobbleY = Math.sin(this.time * 3 + p.x * 0.02) * 3;
          // Body
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y + wobbleY, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          // Tail
          ctx.beginPath();
          ctx.moveTo(p.x - d * p.size, p.y + wobbleY);
          ctx.lineTo(p.x - d * (p.size + p.size * 0.6), p.y + wobbleY - p.size * 0.5);
          ctx.lineTo(p.x - d * (p.size + p.size * 0.6), p.y + wobbleY + p.size * 0.5);
          ctx.closePath();
          ctx.fill();
          // Eye
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(p.x + d * p.size * 0.4, p.y + wobbleY - p.size * 0.15, p.size * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(p.x + d * p.size * 0.45, p.y + wobbleY - p.size * 0.15, p.size * 0.07, 0, Math.PI * 2);
          ctx.fill();
        },
      });
    }

    // Bubbles
    for (let i = 0; i < 10; i++) {
      this.particles.emit({
        x: x + rand(-20, 20),
        y: y + rand(-10, 10),
        vx: rand(-15, 15),
        vy: rand(-80, -30),
        size: rand(3, 10),
        color: '#E0FFFF',
        alpha: 0.5,
        alphaEnd: 0,
        life: rand(1, 3),
        type: 'circle',
        gravity: -30,
        drawFn: (ctx, p) => {
          ctx.globalAlpha = p.alpha * 0.4;
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.stroke();
        },
      });
    }
  }

  onPointerMove(x: number, y: number) {
    if (Math.random() < 0.2) {
      this.particles.emit({
        x, y,
        vx: rand(-5, 5),
        vy: rand(-30, -10),
        size: rand(2, 5),
        color: '#E0FFFF',
        alpha: 0.3,
        alphaEnd: 0,
        life: rand(0.5, 1.5),
        type: 'circle',
        gravity: -20,
      });
    }
  }

  update(dt: number) {
    this.time += dt;
    this.particles.update(dt);

    // Ambient bubbles
    this.ambientTimer += dt;
    if (this.ambientTimer > 0.5) {
      this.ambientTimer = 0;
      this.particles.emit({
        x: rand(0, this.w),
        y: this.h + 10,
        vx: rand(-5, 5),
        vy: rand(-40, -20),
        size: rand(2, 6),
        color: '#E0FFFF',
        alpha: 0.2,
        alphaEnd: 0,
        life: rand(3, 6),
        type: 'circle',
        gravity: -10,
      });
    }
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    const grd = ctx.createLinearGradient(0, 0, 0, this.h);
    grd.addColorStop(0, '#0a3a4c');
    grd.addColorStop(1, '#1a6a7c');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);

    // Seaweed
    for (const sw of this.seaweeds) {
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const segH = sw.height / sw.segments;
      let cx = sw.x;
      let cy = this.h;
      ctx.moveTo(cx, cy);
      for (let i = 0; i < sw.segments; i++) {
        const sway = Math.sin(this.time * 1.5 + sw.phase + i * 0.5) * (10 + i * 2);
        cx = sw.x + sway;
        cy = this.h - (i + 1) * segH;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.draw(ctx);
  }

  destroy() {
    this.particles.clear();
  }
}
