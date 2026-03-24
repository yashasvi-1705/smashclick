export type InputCallback = (x: number, y: number, key?: string) => void;
export type MoveCallback = (x: number, y: number) => void;
export type ParentCallback = () => void;

export class InputManager {
  private canvas: HTMLCanvasElement;
  private onInteraction: InputCallback;
  private onPointerMove: MoveCallback;
  private onParent: ParentCallback;
  private keyBuffer: string[] = [];
  private lastKeyTime = 0;
  private holdTimer: ReturnType<typeof setTimeout> | null = null;
  private holdZone = { x: 0, y: 0, w: 80, h: 80 };
  private bound: Record<string, (e: Event) => void> = {};

  constructor(
    canvas: HTMLCanvasElement,
    onInteraction: InputCallback,
    onPointerMove: MoveCallback,
    onParent: ParentCallback,
  ) {
    this.canvas = canvas;
    this.onInteraction = onInteraction;
    this.onPointerMove = onPointerMove;
    this.onParent = onParent;
    this.bind();
  }

  private bind() {
    const el = this.canvas;

    this.bound.keydown = (e: Event) => {
      const ke = e as KeyboardEvent;
      // Debounce rapid same-key
      const now = Date.now();
      if (now - this.lastKeyTime < 50) return;
      this.lastKeyTime = now;

      // Buffer for "parent" detection
      this.keyBuffer.push(ke.key.toLowerCase());
      if (this.keyBuffer.length > 10) this.keyBuffer.shift();
      if (this.keyBuffer.join('').includes('parent')) {
        this.keyBuffer.length = 0;
        this.onParent();
        return;
      }

      // Prevent default for game keys in fullscreen
      if (document.fullscreenElement) {
        if (['Tab', 'Escape'].includes(ke.key)) return;
        ke.preventDefault();
      }

      const rect = el.getBoundingClientRect();
      const x = rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.6;
      const y = rect.height / 2 + (Math.random() - 0.5) * rect.height * 0.6;
      this.onInteraction(x, y, ke.key);
    };

    this.bound.mousedown = (e: Event) => {
      const me = e as MouseEvent;
      const rect = el.getBoundingClientRect();
      const x = me.clientX - rect.left;
      const y = me.clientY - rect.top;

      // Hold detection in top-left
      if (x < this.holdZone.w && y < this.holdZone.h) {
        this.holdTimer = setTimeout(() => {
          this.onParent();
        }, 2000);
      }

      this.onInteraction(x, y);
    };

    this.bound.mouseup = () => {
      if (this.holdTimer) {
        clearTimeout(this.holdTimer);
        this.holdTimer = null;
      }
    };

    this.bound.mousemove = (e: Event) => {
      const me = e as MouseEvent;
      const rect = el.getBoundingClientRect();
      this.onPointerMove(me.clientX - rect.left, me.clientY - rect.top);
    };

    this.bound.touchstart = (e: Event) => {
      const te = e as TouchEvent;
      te.preventDefault();
      const rect = el.getBoundingClientRect();
      for (let i = 0; i < te.changedTouches.length; i++) {
        const t = te.changedTouches[i];
        const x = t.clientX - rect.left;
        const y = t.clientY - rect.top;

        if (x < this.holdZone.w && y < this.holdZone.h) {
          this.holdTimer = setTimeout(() => {
            this.onParent();
          }, 2000);
        }

        this.onInteraction(x, y);
      }
    };

    this.bound.touchmove = (e: Event) => {
      const te = e as TouchEvent;
      te.preventDefault();
      const rect = el.getBoundingClientRect();
      for (let i = 0; i < te.changedTouches.length; i++) {
        const t = te.changedTouches[i];
        this.onPointerMove(t.clientX - rect.left, t.clientY - rect.top);
      }
    };

    this.bound.touchend = () => {
      if (this.holdTimer) {
        clearTimeout(this.holdTimer);
        this.holdTimer = null;
      }
    };

    document.addEventListener('keydown', this.bound.keydown);
    el.addEventListener('mousedown', this.bound.mousedown);
    document.addEventListener('mouseup', this.bound.mouseup);
    el.addEventListener('mousemove', this.bound.mousemove);
    el.addEventListener('touchstart', this.bound.touchstart, { passive: false });
    el.addEventListener('touchmove', this.bound.touchmove, { passive: false });
    el.addEventListener('touchend', this.bound.touchend);
  }

  destroy() {
    document.removeEventListener('keydown', this.bound.keydown);
    this.canvas.removeEventListener('mousedown', this.bound.mousedown);
    document.removeEventListener('mouseup', this.bound.mouseup);
    this.canvas.removeEventListener('mousemove', this.bound.mousemove);
    this.canvas.removeEventListener('touchstart', this.bound.touchstart);
    this.canvas.removeEventListener('touchmove', this.bound.touchmove);
    this.canvas.removeEventListener('touchend', this.bound.touchend);
    if (this.holdTimer) clearTimeout(this.holdTimer);
  }
}
