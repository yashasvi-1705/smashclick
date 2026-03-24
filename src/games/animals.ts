import { GameEngine } from './types';
import { EMOJIS, SCALES } from '@/lib/constants';
import { rand, pick, easeOutBounce } from '@/lib/utils';

interface Animal {
  emoji: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  age: number;
  bouncePhase: number;
  settled: boolean;
  paradeX: number;
  paradeSpeed: number;
  inParade: boolean;
  entryProgress: number;
}

export class AnimalsGame implements GameEngine {
  id = 'animals';
  name = 'Animal Parade';
  emoji = '🦁';
  description = 'A parade of cute animals!';
  backgroundColor = '#7EC850';
  colors = ['#7EC850', '#5DA83A', '#4A9030', '#8FD960', '#A5E875'];
  musicScale = SCALES.cMajorPentatonic;
  waveform: OscillatorType = 'triangle';

  private w = 0;
  private h = 0;
  private animals: Animal[] = [];
  private time = 0;

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
  }

  onInteraction(x: number, y: number) {
    const emoji = pick(EMOJIS.animals);
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -60 : this.w + 60;
    const targetX = rand(this.w * 0.1, this.w * 0.9);
    const targetY = rand(this.h * 0.2, this.h * 0.7);

    this.animals.push({
      emoji,
      x: startX,
      y: targetY,
      targetX,
      targetY,
      size: rand(40, 70),
      age: 0,
      bouncePhase: 0,
      settled: false,
      paradeX: 0,
      paradeSpeed: rand(40, 80),
      inParade: false,
      entryProgress: 0,
    });

    // Keep manageable count
    if (this.animals.length > 30) {
      this.animals.shift();
    }
  }

  onPointerMove(_x: number, _y: number) {}

  update(dt: number) {
    this.time += dt;

    const paradeThreshold = 5;

    for (const a of this.animals) {
      a.age += dt;

      if (!a.settled) {
        // Entry animation
        a.entryProgress = Math.min(1, a.entryProgress + dt * 2);
        const t = easeOutBounce(a.entryProgress);
        a.x = a.x + (a.targetX - a.x) * (dt * 4);
        a.bouncePhase = t;

        if (a.entryProgress >= 1) {
          a.settled = true;
          a.x = a.targetX;
        }
      }

      // After enough animals, start parade
      if (this.animals.length >= paradeThreshold && a.settled && a.age > 2) {
        a.inParade = true;
      }

      if (a.inParade) {
        a.x += a.paradeSpeed * dt;
        if (a.x > this.w + 80) {
          a.x = -80;
        }
      }
    }
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    // Sky
    const grd = ctx.createLinearGradient(0, 0, 0, this.h);
    grd.addColorStop(0, '#87CEEB');
    grd.addColorStop(0.6, '#B0E0E6');
    grd.addColorStop(0.7, '#7EC850');
    grd.addColorStop(1, '#5DA83A');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);

    // Grass tufts
    ctx.fillStyle = '#5DA83A';
    for (let x = 0; x < this.w; x += 30) {
      const gh = 10 + Math.sin(x * 0.1 + this.time) * 5;
      ctx.beginPath();
      ctx.moveTo(x, this.h * 0.7);
      ctx.lineTo(x + 10, this.h * 0.7 - gh);
      ctx.lineTo(x + 20, this.h * 0.7);
      ctx.fill();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const a of this.animals) {
      const bob = a.inParade ? Math.sin(this.time * 4 + a.x * 0.05) * 5 : 0;
      const bounce = a.settled ? 0 : Math.sin(a.bouncePhase * Math.PI) * 20;

      ctx.font = `${a.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.emoji, a.x, a.y - bounce + bob);
    }
  }

  destroy() {
    this.animals.length = 0;
  }
}
