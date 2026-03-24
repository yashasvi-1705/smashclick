import { GameEngine } from './types';
import { ParticleSystem } from '@/engine/ParticleSystem';
import { AudioEngine } from '@/engine/AudioEngine';
import { SCALES } from '@/lib/constants';
import { rand, pick } from '@/lib/utils';

interface DrumZone {
  name: string;
  type: 'kick' | 'snare' | 'hihat' | 'tom' | 'cymbal' | 'clap';
  color: string;
  flashAlpha: number;
  keys: string[];
}

export class DrumsGame implements GameEngine {
  id = 'drums';
  name = 'Drum Kit';
  emoji = '🥁';
  description = 'Beat the drums and make music!';
  backgroundColor = '#1a1a2e';
  colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF6BCB', '#A66CFF', '#FF8C32', '#00D2FF'];
  musicScale = SCALES.pentatonic;
  waveform: OscillatorType = 'square';

  private particles = new ParticleSystem();
  private w = 0;
  private h = 0;
  private zones: DrumZone[] = [];
  private cols = 4;
  private rows = 2;

  init(_ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.w = w;
    this.h = h;
    this.zones = [
      { name: 'KICK', type: 'kick', color: '#FF6B6B', flashAlpha: 0, keys: ['a', 'A'] },
      { name: 'SNARE', type: 'snare', color: '#FFD93D', flashAlpha: 0, keys: ['s', 'S'] },
      { name: 'HI-HAT', type: 'hihat', color: '#6BCB77', flashAlpha: 0, keys: ['d', 'D'] },
      { name: 'TOM', type: 'tom', color: '#4D96FF', flashAlpha: 0, keys: ['f', 'F'] },
      { name: 'CYMBAL', type: 'cymbal', color: '#FF6BCB', flashAlpha: 0, keys: ['j', 'J'] },
      { name: 'CLAP', type: 'clap', color: '#A66CFF', flashAlpha: 0, keys: ['k', 'K'] },
      { name: 'LOW TOM', type: 'tom', color: '#FF8C32', flashAlpha: 0, keys: ['l', 'L'] },
      { name: 'CRASH', type: 'cymbal', color: '#00D2FF', flashAlpha: 0, keys: [';', ':'] },
    ];
  }

  private getZoneIndex(x: number, y: number): number {
    const col = Math.floor(x / (this.w / this.cols));
    const row = Math.floor(y / (this.h / this.rows));
    return Math.min(row * this.cols + col, this.zones.length - 1);
  }

  private hitZone(index: number) {
    const zone = this.zones[index];
    if (!zone) return;

    zone.flashAlpha = 1;

    const zoneW = this.w / this.cols;
    const zoneH = this.h / this.rows;
    const col = index % this.cols;
    const row = Math.floor(index / this.cols);
    const cx = col * zoneW + zoneW / 2;
    const cy = row * zoneH + zoneH / 2;

    // Shockwave ring
    this.particles.emit({
      x: cx, y: cy,
      size: 10,
      sizeEnd: Math.max(zoneW, zoneH) * 0.6,
      color: zone.color,
      alpha: 0.6,
      alphaEnd: 0,
      life: 0.5,
      type: 'ring',
    });

    // Burst particles
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(100, 300);
      this.particles.emit({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: rand(3, 8),
        sizeEnd: 0,
        color: zone.color,
        alpha: 0.8,
        alphaEnd: 0,
        life: rand(0.3, 0.8),
        type: 'circle',
        friction: 0.95,
      });
    }

    // Play drum sound
    AudioEngine.playDrum(zone.type);
  }

  onInteraction(x: number, y: number, key?: string) {
    if (key) {
      const idx = this.zones.findIndex(z => z.keys.includes(key));
      if (idx >= 0) {
        this.hitZone(idx);
        return;
      }
    }
    const idx = this.getZoneIndex(x, y);
    this.hitZone(idx);
  }

  onPointerMove(_x: number, _y: number) {}

  update(dt: number) {
    this.particles.update(dt);
    for (const zone of this.zones) {
      zone.flashAlpha = Math.max(0, zone.flashAlpha - dt * 3);
    }
  }

  drawBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, this.w, this.h);

    const zoneW = this.w / this.cols;
    const zoneH = this.h / this.rows;

    for (let i = 0; i < this.zones.length; i++) {
      const zone = this.zones[i];
      const col = i % this.cols;
      const row = Math.floor(i / this.cols);
      const x = col * zoneW;
      const y = row * zoneH;

      // Flash
      if (zone.flashAlpha > 0) {
        ctx.globalAlpha = zone.flashAlpha * 0.3;
        ctx.fillStyle = zone.color;
        ctx.fillRect(x, y, zoneW, zoneH);
      }

      // Border
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = zone.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, y + 2, zoneW - 4, zoneH - 4);

      // Label
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = zone.color;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(zone.name, x + zoneW / 2, y + zoneH / 2);
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
