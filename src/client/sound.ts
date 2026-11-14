// Short beeps made with the Web Audio API (no audio files to load).

let audio: AudioContext | null = null;

/** Browsers only allow sound after a user gesture: call this from a click. */
export function unlockAudio(): void {
  try {
    audio ??= new AudioContext();
    if (audio.state === 'suspended') void audio.resume();
  } catch { audio = null; }
}

export function beep(freq: number, dur: number, times: number): void {
  if (!audio) return;
  for (let k = 0; k < times; k++) {
    const start = audio.currentTime + k * (dur + 0.12);
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }
}
