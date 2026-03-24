import { GameEngine } from './types';
import { SCALES } from '@/lib/constants';
import { rand, pick } from '@/lib/utils';

interface PaintBlob {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
}

interface SplatDot {
  x: number;
  y: number;
  size: number;
  color: string;
}

export class PaintGame implements GameEngine {
  id = 'paint';
  name = 'Finger Paint';
  emoji = '🎨';
  description = 'Paint and splatter everywhere!';
  backgroundColor = '#FFF8F0';
  colors = ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#FF6BCB', '#A29BFE', '#55E6C1', '#5F27CD', '#FF5252', '#2ED573'];
  musicScale = SCALES.wholeTone;
  waveform: OscillatorType = 'sine';

  private w = 0;
  private h = 0;
  private paintCanvas: HTMLCanvasElement | null = null;
  private paintCtx: CanvasRenderingContext2D | null = null;
  private colorIndex = 0;
  private lastPointer = { x: -1, y: -1 };
  private cornerTaps: number[] = [];

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
    // Create offscreen canvas for persistent paint
    this.paintCanvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    this.paintCanvas.width = w * dpr;
    this.paintCanvas.height = h * dpr;
    this.paintCtx = this.paintCanvas.getContext('2d')!;
    this.paintCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Fill with cream
    this.paintCtx.fillStyle = this.backgroundColor;
    this.paintCtx.fillRect(0, 0, w, h);
  }

  private nextColor(): string {
    const c = this.colors[this.colorIndex % this.colors.length];
    this.colorIndex++;
    return c;
  }

  onInteraction(x: number, y: number) {
    if (!this.paintCtx) return;

    // Corner tap detection for clear
    if (x < 60 && y < 60) {
      const now = Date.now();
      this.cornerTaps.push(now);
      this.cornerTaps = this.cornerTaps.filter(t => now - t < 1500);
      if (this.cornerTaps.length >= 3) {
        this.cornerTaps.length = 0;
        this.paintCtx.fillStyle = this.backgroundColor;
        this.paintCtx.fillRect(0, 0, this.w, this.h);
        return;
      }
    }

    const color = this.nextColor();
    const ctx = this.paintCtx;

    // Splatter effect
    const count = 8 + Math.floor(Math.random() * 10);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = rand(10, 80);
      const sx = x + Math.cos(angle) * dist;
      const sy = y + Math.sin(angle) * dist;
      const size = rand(5, 25);
      ctx.globalAlpha = rand(0.5, 0.9);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center blob
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rand(20, 40), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  onPointerMove(x: number, y: number) {
    if (!this.paintCtx) return;
    if (this.lastPointer.x < 0) {
      this.lastPointer = { x, y };
      return;
    }

    const color = this.colors[this.colorIndex % this.colors.length];
    const ctx = this.paintCtx;
    ctx.strokeStyle = color;
    ctx.lineWidth = rand(8, 20);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(this.lastPointer.x, this.lastPointer.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalAlpha = 1;

    this.lastPointer = { x, y };
  }

  update(_dt: number) {}

  drawBackground(ctx: CanvasRenderingContext2D) {
    if (this.paintCanvas) {
      ctx.drawImage(this.paintCanvas, 0, 0, this.w, this.h);
    } else {
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, this.w, this.h);
    }
  }

  draw(_ctx: CanvasRenderingContext2D) {}

  destroy() {
    this.paintCanvas = null;
    this.paintCtx = null;
  }
}
