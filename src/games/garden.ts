import { GameEngine } from './types';
import { ParticleSystem } from '@/engine/ParticleSystem';
import { SCALES } from '@/lib/constants';
import { rand, pick } from '@/lib/utils';

interface Flower {
  x: number;
  baseY: number;
  stemHeight: number;
  petalColor: string;
  petalCount: number;
  petalSize: number;
  growProgress: number;
  type: 'rose' | 'tulip' | 'daisy' | 'sunflower';
}

interface Butterfly {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  wingPhase: number;
  color: string;
  speed: number;
}

export class GardenGame implements GameEngine {
  id = 'garden';
  name = 'Magic Garden';
  emoji = '🌸';
  description = 'Grow flowers and butterflies!';
  backgroundColor = '#87CEEB';
  colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FF6347', '#FFD700', '#FFA500', '#DA70D6', '#FF85A1'];
  musicScale = SCALES.fMajor;
  waveform: OscillatorType = 'sine';

  private particles = new ParticleSystem();
  private flowers: Flower[] = [];
  private butterflies: Butterfly[] = [];
  private w = 0;
  private h = 0;
  private time = 0;
  private cloudX = 0;

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
    this.cloudX = 0;
  }

  onInteraction(x: number, y: number, key?: string) {
    const types: Flower['type'][] = ['rose', 'tulip', 'daisy', 'sunflower'];
    let type: Flower['type'];
    if (key) {
      const code = key.charCodeAt(0);
      type = types[code % types.length];
    } else {
      type = pick(types);
    }

    const petalColors: Record<string, string> = {
      rose: '#FF1493',
      tulip: '#FF6347',
      daisy: '#FFFFFF',
      sunflower: '#FFD700',
    };

    this.flowers.push({
      x: x || rand(50, this.w - 50),
      baseY: this.h,
      stemHeight: rand(100, 200),
      petalColor: petalColors[type],
      petalCount: type === 'daisy' ? 12 : type === 'sunflower' ? 16 : 6,
      petalSize: type === 'sunflower' ? 18 : rand(10, 16),
      growProgress: 0,
      type,
    });

    if (this.flowers.length > 40) this.flowers.shift();
  }

  onPointerMove(x: number, y: number) {
    // Spawn butterfly
    if (Math.random() < 0.05) {
      this.butterflies.push({
        x, y,
        targetX: rand(0, this.w),
        targetY: rand(this.h * 0.1, this.h * 0.6),
        wingPhase: 0,
        color: pick(['#FF69B4', '#FFD700', '#87CEEB', '#DDA0DD', '#FF6347', '#9370DB']),
        speed: rand(40, 80),
      });
      if (this.butterflies.length > 20) this.butterflies.shift();
    }
  }

  update(dt: number) {
    this.time += dt;
    this.cloudX += dt * 15;
    this.particles.update(dt);

    for (const f of this.flowers) {
      if (f.growProgress < 1) {
        f.growProgress = Math.min(1, f.growProgress + dt * 0.8);
      }
    }

    for (const b of this.butterflies) {
      b.wingPhase += dt * 8;
      const dx = b.targetX - b.x;
      const dy = b.targetY - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 10) {
        b.targetX = rand(0, this.w);
        b.targetY = rand(this.h * 0.1, this.h * 0.6);
      }
      b.x += (dx / d) * b.speed * dt;
      b.y += (dy / d) * b.speed * dt + Math.sin(this.time * 2) * 0.5;
    }

    // Bees after many flowers
    if (this.flowers.length > 8 && Math.random() < 0.02) {
      const f = pick(this.flowers);
      this.particles.emit({
        x: f.x, y: f.baseY - f.stemHeight * f.growProgress,
        vx: rand(-30, 30),
        vy: rand(-30, 30),
        size: 8,
        emoji: '🐝',
        type: 'emoji',
        life: rand(3, 6),
        alpha: 1,
        alphaEnd: 0,
        friction: 0.98,
      });
    }
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    // Sky
    const grd = ctx.createLinearGradient(0, 0, 0, this.h);
    grd.addColorStop(0, '#87CEEB');
    grd.addColorStop(0.65, '#B0E0E6');
    grd.addColorStop(0.65, '#4CAF50');
    grd.addColorStop(1, '#388E3C');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);

    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(this.w - 80, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    // Rays
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + this.time * 0.3;
      ctx.strokeStyle = '#FFD700';
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.w - 80 + Math.cos(angle) * 48, 80 + Math.sin(angle) * 48);
      ctx.lineTo(this.w - 80 + Math.cos(angle) * 65, 80 + Math.sin(angle) * 65);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Clouds
    const drawCloud = (cx: number, cy: number) => {
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 10, 25, 0, Math.PI * 2);
      ctx.arc(cx + 50, cy, 30, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy + 5, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };
    drawCloud((this.cloudX % (this.w + 200)) - 100, 60);
    drawCloud(((this.cloudX * 0.7 + 300) % (this.w + 200)) - 100, 120);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Flowers
    for (const f of this.flowers) {
      const progress = f.growProgress;
      const stemH = f.stemHeight * progress;
      const topY = f.baseY - stemH;

      // Stem
      ctx.strokeStyle = '#228B22';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(f.x, f.baseY);
      ctx.lineTo(f.x, topY);
      ctx.stroke();

      // Leaves
      if (progress > 0.3) {
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.ellipse(f.x + 12, f.baseY - stemH * 0.4, 10, 5, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Petals (bloom after stem grows)
      if (progress > 0.6) {
        const bloom = Math.min(1, (progress - 0.6) / 0.4);
        ctx.fillStyle = f.petalColor;

        if (f.type === 'daisy' || f.type === 'sunflower' || f.type === 'rose') {
          for (let i = 0; i < f.petalCount; i++) {
            const angle = (i / f.petalCount) * Math.PI * 2;
            const px = f.x + Math.cos(angle) * f.petalSize * bloom;
            const py = topY + Math.sin(angle) * f.petalSize * bloom;
            ctx.beginPath();
            ctx.arc(px, py, f.petalSize * 0.4 * bloom, 0, Math.PI * 2);
            ctx.fill();
          }
          // Center
          ctx.fillStyle = f.type === 'sunflower' ? '#8B4513' : '#FFD700';
          ctx.beginPath();
          ctx.arc(f.x, topY, f.petalSize * 0.3 * bloom, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Tulip
          ctx.beginPath();
          ctx.moveTo(f.x - f.petalSize * bloom, topY);
          ctx.quadraticCurveTo(f.x - f.petalSize * 0.5 * bloom, topY - f.petalSize * 1.5 * bloom, f.x, topY - f.petalSize * bloom);
          ctx.quadraticCurveTo(f.x + f.petalSize * 0.5 * bloom, topY - f.petalSize * 1.5 * bloom, f.x + f.petalSize * bloom, topY);
          ctx.fill();
        }
      }
    }

    // Butterflies
    for (const b of this.butterflies) {
      const wingFlap = Math.sin(b.wingPhase) * 0.5;
      ctx.save();
      ctx.translate(b.x, b.y);

      // Left wing
      ctx.fillStyle = b.color;
      ctx.globalAlpha = 0.8;
      ctx.save();
      ctx.scale(1, 0.5 + wingFlap);
      ctx.beginPath();
      ctx.ellipse(-8, 0, 10, 8, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right wing
      ctx.save();
      ctx.scale(1, 0.5 + wingFlap);
      ctx.beginPath();
      ctx.ellipse(8, 0, 10, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Body
      ctx.fillStyle = '#333';
      ctx.fillRect(-1, -6, 2, 12);

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    this.particles.draw(ctx);
  }

  destroy() {
    this.particles.clear();
    this.flowers.length = 0;
    this.butterflies.length = 0;
  }
}
