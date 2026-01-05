const audioCtx = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export function playSound(type: "new-order" | "rider-assigned") {
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (type === "new-order") {
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  } else if (type === "rider-assigned") {
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  }
}