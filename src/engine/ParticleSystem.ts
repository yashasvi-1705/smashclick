import { lerp } from '@/lib/utils';

export interface ParticleConfig {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  ax?: number;
  ay?: number;
  size?: number;
  sizeEnd?: number;
  rotation?: number;
  rotationSpeed?: number;
  color?: string;
  colorEnd?: string;
  alpha?: number;
  alphaEnd?: number;
  life?: number;
  type?: 'circle' | 'rect' | 'star' | 'ring' | 'trail' | 'emoji';
  emoji?: string;
  gravity?: number;
  friction?: number;
  composite?: GlobalCompositeOperation;
  drawFn?: (ctx: CanvasRenderingContext2D, p: Particle) => void;
}

export interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  size: number;
  sizeStart: number;
  sizeEnd: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  colorEnd: string;
  alpha: number;
  alphaStart: number;
  alphaEnd: number;
  life: number;
  maxLife: number;
  age: number;
  type: 'circle' | 'rect' | 'star' | 'ring' | 'trail' | 'emoji';
  emoji: string;
  gravity: number;
  friction: number;
  composite: GlobalCompositeOperation;
  drawFn: ((ctx: CanvasRenderingContext2D, p: Particle) => void) | null;
  trail: { x: number; y: number }[];
}

const MAX_PARTICLES = 2000;

export class ParticleSystem {
  particles: Particle[] = [];
  private pool: Particle[] = [];

  constructor() {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.pool.push(this.createBlank());
    }
  }

  private createBlank(): Particle {
    return {
      active: false,
      x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0,
      size: 10, sizeStart: 10, sizeEnd: 0,
      rotation: 0, rotationSpeed: 0,
      color: '#ffffff', colorEnd: '#ffffff',
      alpha: 1, alphaStart: 1, alphaEnd: 0,
      life: 1, maxLife: 1, age: 0,
      type: 'circle', emoji: '',
      gravity: 0, friction: 1,
      composite: 'source-over',
      drawFn: null,
      trail: [],
    };
  }

  emit(config: ParticleConfig): Particle | null {
    let p: Particle | undefined;

    // Try to reuse from pool
    for (let i = 0; i < this.pool.length; i++) {
      if (!this.pool[i].active) {
        p = this.pool[i];
        break;
      }
    }

    // If pool is full, recycle oldest active particle
    if (!p) {
      let oldest: Particle | null = null;
      let oldestAge = -1;
      for (const particle of this.pool) {
        if (particle.age > oldestAge) {
          oldestAge = particle.age;
          oldest = particle;
        }
      }
      if (oldest) {
        oldest.active = false;
        p = oldest;
      } else {
        return null;
      }
    }

    p.active = true;
    p.x = config.x;
    p.y = config.y;
    p.vx = config.vx ?? 0;
    p.vy = config.vy ?? 0;
    p.ax = config.ax ?? 0;
    p.ay = config.ay ?? 0;
    p.size = config.size ?? 10;
    p.sizeStart = p.size;
    p.sizeEnd = config.sizeEnd ?? 0;
    p.rotation = config.rotation ?? 0;
    p.rotationSpeed = config.rotationSpeed ?? 0;
    p.color = config.color ?? '#ffffff';
    p.colorEnd = config.colorEnd ?? p.color;
    p.alpha = config.alpha ?? 1;
    p.alphaStart = p.alpha;
    p.alphaEnd = config.alphaEnd ?? 0;
    p.life = config.life ?? 1;
    p.maxLife = p.life;
    p.age = 0;
    p.type = config.type ?? 'circle';
    p.emoji = config.emoji ?? '';
    p.gravity = config.gravity ?? 0;
    p.friction = config.friction ?? 1;
    p.composite = config.composite ?? 'source-over';
    p.drawFn = config.drawFn ?? null;
    p.trail = [];

    if (!this.particles.includes(p)) {
      this.particles.push(p);
    }

    return p;
  }

  emitBurst(count: number, config: Omit<ParticleConfig, 'vx' | 'vy'> & {
    speed?: number;
    speedVariance?: number;
    spread?: number;
    angle?: number;
  }): void {
    const speed = config.speed ?? 200;
    const speedVar = config.speedVariance ?? 50;
    const spread = config.spread ?? Math.PI * 2;
    const baseAngle = config.angle ?? 0;

    for (let i = 0; i < count; i++) {
      const angle = baseAngle - spread / 2 + Math.random() * spread;
      const spd = speed + (Math.random() - 0.5) * speedVar * 2;
      this.emit({
        ...config,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
      });
    }
  }

  update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      if (!p.active) {
        this.particles.splice(i, 1);
        continue;
      }

      p.age += dt;
      if (p.age >= p.maxLife) {
        p.active = false;
        this.particles.splice(i, 1);
        continue;
      }

      const t = p.age / p.maxLife;

      // Physics
      p.vy += p.gravity * dt;
      p.vx += p.ax * dt;
      p.vy += p.ay * dt;
      p.vx *= Math.pow(p.friction, dt);
      p.vy *= Math.pow(p.friction, dt);

      // Trail
      if (p.type === 'trail') {
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 20) p.trail.shift();
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.rotationSpeed * dt;

      // Interpolate
      p.size = lerp(p.sizeStart, p.sizeEnd, t);
      p.alpha = lerp(p.alphaStart, p.alphaEnd, t);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      if (!p.active || p.alpha <= 0 || p.size <= 0) continue;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.globalCompositeOperation = p.composite;

      if (p.drawFn) {
        p.drawFn(ctx, p);
        ctx.restore();
        continue;
      }

      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      switch (p.type) {
        case 'circle':
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'rect':
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          break;

        case 'star': {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const r = i % 2 === 0 ? p.size : p.size * 0.4;
            if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'ring':
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'trail':
          if (p.trail.length > 1) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
          break;

        case 'emoji':
          ctx.font = `${p.size * 2}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
          break;
      }

      ctx.restore();
    }
  }

  clear(): void {
    for (const p of this.particles) {
      p.active = false;
    }
    this.particles.length = 0;
  }

  get activeCount(): number {
    return this.particles.length;
  }
}
