import { GameEngine } from './types';
import { ParticleSystem } from '@/engine/ParticleSystem';
import { SCALES } from '@/lib/constants';
import { rand, pick } from '@/lib/utils';

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  colors: string[];
  active: boolean;
}

export class FireworksGame implements GameEngine {
  id = 'fireworks';
  name = 'Fireworks Show';
  emoji = '🎆';
  description = 'Launch spectacular fireworks!';
  backgroundColor = '#0a0a1a';
  colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BCB', '#A66CFF', '#FF8C32'];
  musicScale = SCALES.pentatonic;
  waveform: OscillatorType = 'square';

  private particles = new ParticleSystem();
  private rockets: Rocket[] = [];
  private w = 0;
  private h = 0;
  private time = 0;

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  onInteraction(x: number, _y: number) {
    const palette = [
      ['#FF6B6B', '#FF8E8E', '#FFB4B4'],
      ['#FFD93D', '#FFE566', '#FFF2A1'],
      ['#6BCB77', '#8FDB97', '#B5EABD'],
      ['#4D96FF', '#7BB4FF', '#A8D1FF'],
      ['#FF6BCB', '#FF8ED8', '#FFB4E8'],
      ['#A66CFF', '#BF94FF', '#D4B8FF'],
    ];
    const colors = pick(palette);

    this.rockets.push({
      x: x,
      y: this.h,
      targetY: rand(this.h * 0.15, this.h * 0.5),
      vy: -rand(400, 600),
      color: colors[0],
      colors,
      active: true,
    });
  }

  onPointerMove(_x: number, _y: number) {}

  private explode(x: number, y: number, colors: string[]) {
    const type = Math.random();
    const count = 60 + Math.floor(Math.random() * 40);

    if (type < 0.4) {
      // Sphere
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(80, 250);
        this.particles.emit({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: rand(2, 4),
          sizeEnd: 0,
          color: pick(colors),
          alpha: 1,
          alphaEnd: 0,
          life: rand(1, 2.5),
          type: 'circle',
          gravity: 60,
          friction: 0.97,
          composite: 'lighter',
        });
      }
    } else if (type < 0.7) {
      // Ring
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = rand(120, 200);
        this.particles.emit({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: rand(2, 4),
          sizeEnd: 0,
          color: pick(colors),
          alpha: 1,
          alphaEnd: 0,
          life: rand(1.5, 2.5),
          type: 'circle',
          gravity: 40,
          friction: 0.98,
          composite: 'lighter',
        });
      }
    } else {
      // Willow (drooping trails)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(60, 180);
        this.particles.emit({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 50,
          size: rand(2, 3),
          sizeEnd: 1,
          color: pick(colors),
          alpha: 1,
          alphaEnd: 0,
          life: rand(2, 4),
          type: 'trail',
          gravity: 100,
          friction: 0.96,
          composite: 'lighter',
        });
      }
    }

    // Central flash
    this.particles.emit({
      x, y,
      size: 30,
      sizeEnd: 0,
      color: '#ffffff',
      alpha: 0.8,
      alphaEnd: 0,
      life: 0.3,
      type: 'circle',
      composite: 'lighter',
    });
  }

  update(dt: number) {
    this.time += dt;
    this.particles.update(dt);

    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      if (!r.active) {
        this.rockets.splice(i, 1);
        continue;
      }

      r.y += r.vy * dt;

      // Trail
      this.particles.emit({
        x: r.x + rand(-2, 2),
        y: r.y,
        vx: rand(-10, 10),
        vy: rand(10, 40),
        size: rand(2, 4),
        sizeEnd: 0,
        color: r.color,
        alpha: 0.8,
        alphaEnd: 0,
        life: rand(0.3, 0.6),
        type: 'circle',
        composite: 'lighter',
      });

      if (r.y <= r.targetY) {
        r.active = false;
        this.explode(r.x, r.y, r.colors);
      }
    }
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    const grd = ctx.createLinearGradient(0, 0, 0, this.h);
    grd.addColorStop(0, '#0a0a1a');
    grd.addColorStop(1, '#1a1a3a');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw rockets
    for (const r of this.rockets) {
      if (!r.active) continue;
      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    this.particles.draw(ctx);
  }

  destroy() {
    this.particles.clear();
    this.rockets.length = 0;
  }
}
