import { GameEngine } from './types';
import { ParticleSystem } from '@/engine/ParticleSystem';
import { SCALES } from '@/lib/constants';
import { rand } from '@/lib/utils';

export class BubblesGame implements GameEngine {
  id = 'bubbles';
  name = 'Bubble Pop';
  emoji = '🫧';
  description = 'Floating dreamy bubbles!';
  backgroundColor = '#0a1628';
  colors = ['#87CEEB', '#B0E0E6', '#ADD8E6', '#E0FFFF', '#AFEEEE', '#7EC8E3', '#C1E1FF'];
  musicScale = SCALES.ebMajor;
  waveform: OscillatorType = 'sine';

  private particles = new ParticleSystem();
  private w = 0;
  private h = 0;
  private time = 0;

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  onInteraction(x: number, y: number) {
    const count = 15 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
      const size = rand(10, 60);
      const startX = x + rand(-40, 40);
      this.particles.emit({
        x: startX,
        y: y + rand(-20, 20),
        vx: rand(-30, 30),
        vy: rand(-120, -40),
        size,
        sizeEnd: size * 0.3,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 0.6,
        alphaEnd: 0,
        life: rand(2, 4),
        type: 'circle',
        gravity: -20,
        friction: 0.99,
        drawFn: (ctx, p) => {
          const wobble = Math.sin(this.time * 3 + p.x * 0.01) * 5;
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.3;
          ctx.arc(p.x + wobble, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          // Highlight
          ctx.beginPath();
          ctx.globalAlpha = p.alpha * 0.6;
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 2;
          ctx.arc(p.x + wobble, p.y, p.size, 0, Math.PI * 2);
          ctx.stroke();
          // Shine
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.globalAlpha = p.alpha * 0.7;
          ctx.arc(p.x + wobble - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
          ctx.fill();
        },
      });
    }
  }

  onPointerMove(x: number, y: number) {
    if (Math.random() < 0.15) {
      this.particles.emit({
        x, y,
        vx: rand(-10, 10),
        vy: rand(-40, -20),
        size: rand(5, 15),
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 0.4,
        alphaEnd: 0,
        life: rand(1, 2),
        type: 'circle',
        gravity: -15,
        drawFn: (ctx, p) => {
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.3;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        },
      });
    }
  }

  update(dt: number) {
    this.time += dt;
    this.particles.update(dt);
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    const grd = ctx.createLinearGradient(0, 0, 0, this.h);
    grd.addColorStop(0, '#0a1628');
    grd.addColorStop(1, '#1a3a5c');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.particles.draw(ctx);
  }

  destroy() {
    this.particles.clear();
  }
}
