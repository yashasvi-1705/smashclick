export interface GameEngine {
  id: string;
  name: string;
  emoji: string;
  description: string;
  backgroundColor: string;
  colors: string[];
  musicScale: number[];
  waveform: OscillatorType;

  init(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  onInteraction(x: number, y: number, key?: string): void;
  onPointerMove(x: number, y: number): void;
  update(dt: number): void;
  drawBackground(ctx: CanvasRenderingContext2D): void;
  draw(ctx: CanvasRenderingContext2D): void;
  destroy(): void;
}
