export const COLORS = {
  rainbow: ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#FF6BCB', '#A29BFE', '#55E6C1', '#FD7272'],
  pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E8BAFF'],
  neon: ['#FF073A', '#39FF14', '#FF61F6', '#00FFFF', '#FFE600', '#FF6700'],
  ocean: ['#006994', '#00A8CC', '#45B7D1', '#96E6FF', '#E0F7FF'],
  fire: ['#FF4500', '#FF6347', '#FF7F50', '#FFA07A', '#FFD700', '#FFEC8B'],
  garden: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#FF85A1', '#FF2E63'],
  night: ['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#DDA0DD', '#98FB98'],
};

export const SCALES = {
  cMajor: [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25],
  ebMajor: [311.13, 349.23, 392.0, 415.3, 466.16, 523.25, 587.33, 622.25],
  aMinorPentatonic: [220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33],
  fMajor: [174.61, 196.0, 220.0, 233.08, 261.63, 293.66, 329.63, 349.23],
  wholeTone: [261.63, 293.66, 329.63, 369.99, 415.3, 466.16, 523.25, 587.33],
  pentatonic: [130.81, 146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63],
  cMajorPentatonic: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25],
};

export const EMOJIS = {
  animals: ['🐱', '🐶', '🐻', '🦊', '🐸', '🐵', '🦁', '🐧', '🐬', '🐙', '🦋', '🐢', '🦄', '🐮', '🐷', '🐔', '🦆', '🐝', '🐛', '🦀'],
  nature: ['🌸', '🌻', '🌺', '🌹', '🌷', '🌼', '💐', '🌿', '🍀', '🌳'],
  space: ['⭐', '🌟', '✨', '💫', '🌙', '☄️', '🪐', '🌍'],
  food: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍌', '🍉'],
  fun: ['🎉', '🎊', '🎈', '🎸', '🎵', '🎶', '❤️', '💖', '⚡', '🔥', '🌈', '💎'],
  faces: ['😀', '😂', '🥰', '😎', '🤩', '😜', '🤗', '😻', '👻', '🤖'],
};

export const GAME_IDS = [
  'confetti', 'bubbles', 'space', 'ocean', 'fireworks',
  'paint', 'animals', 'rainbow', 'drums', 'garden',
] as const;

export type GameId = typeof GAME_IDS[number];
