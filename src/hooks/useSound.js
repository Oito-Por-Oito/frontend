import { useCallback, useRef } from 'react';

// Helper para obter configurações de som do localStorage
const getSoundSettings = () => {
  try {
    const saved = localStorage.getItem('chess-sound-settings');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Error reading sound settings:', e);
  }
  return { enabled: true, volume: 0.7, sounds: { move: true, capture: true, check: true, matchFound: true, gameEnd: true } };
};

// Criar sons usando Web Audio API (sem arquivos externos)
const createTone = (frequency, duration, type = 'sine', volumeMultiplier = 1) => {
  return () => {
    const settings = getSoundSettings();
    if (!settings.enabled) return;
    
    const volume = settings.volume * 0.3 * volumeMultiplier;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Audio not supported:', e);
    }
  };
};

// Som de "match encontrado" - sequência de notas ascendentes
const playMatchFoundSound = () => {
  const settings = getSoundSettings();
  if (!settings.enabled || !settings.sounds.matchFound) return;
  
  const volume = settings.volume * 0.2;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playNote = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      gainNode.gain.setValueAtTime(volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    // Sequência de notas: C5, E5, G5 (acorde maior ascendente)
    playNote(523.25, now, 0.15);        // C5
    playNote(659.25, now + 0.12, 0.15); // E5
    playNote(783.99, now + 0.24, 0.25); // G5
  } catch (e) {
    console.warn('Audio not supported:', e);
  }
};

// Som de movimento de peça
const playMoveSound = () => {
  const settings = getSoundSettings();
  if (!settings.enabled || !settings.sounds.move) return;
  createTone(440, 0.1, 'sine', 1)();
};

// Som de captura
const playCaptureSound = () => {
  const settings = getSoundSettings();
  if (!settings.enabled || !settings.sounds.capture) return;
  
  const volume = settings.volume * 0.3;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (e) {
    console.warn('Audio not supported:', e);
  }
};

// Som de xeque
const playCheckSound = () => {
  const settings = getSoundSettings();
  if (!settings.enabled || !settings.sounds.check) return;
  
  const volume = settings.volume * 0.15;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playNote = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      gainNode.gain.setValueAtTime(volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    playNote(880, now, 0.1);
    playNote(880, now + 0.15, 0.1);
  } catch (e) {
    console.warn('Audio not supported:', e);
  }
};

// Som de fim de jogo (vitória/derrota)
const playGameEndSound = (isWin) => {
  const settings = getSoundSettings();
  if (!settings.enabled || !settings.sounds.gameEnd) return;
  
  const volume = settings.volume * 0.25;
  
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playNote = (frequency, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);
      
      gainNode.gain.setValueAtTime(volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    
    if (isWin) {
      // Acorde maior ascendente para vitória
      playNote(523.25, now, 0.2);        // C5
      playNote(659.25, now + 0.15, 0.2); // E5
      playNote(783.99, now + 0.30, 0.2); // G5
      playNote(1046.50, now + 0.45, 0.4); // C6
    } else {
      // Notas descendentes para derrota
      playNote(392, now, 0.3);        // G4
      playNote(349.23, now + 0.25, 0.3); // F4
      playNote(293.66, now + 0.50, 0.5); // D4
    }
  } catch (e) {
    console.warn('Audio not supported:', e);
  }
};

// Som de tempo baixo (warning)
const playLowTimeSound = () => {
  const settings = getSoundSettings();
  if (!settings.enabled) return;
  createTone(600, 0.08, 'square', 0.5)();
};

export function useSound() {
  const lastLowTimeSound = useRef(0);

  const playMatchFound = useCallback(() => {
    playMatchFoundSound();
  }, []);

  const playMove = useCallback(() => {
    playMoveSound();
  }, []);

  const playCapture = useCallback(() => {
    playCaptureSound();
  }, []);

  const playCheck = useCallback(() => {
    playCheckSound();
  }, []);

  const playGameEnd = useCallback((isWin) => {
    playGameEndSound(isWin);
  }, []);

  const playLowTime = useCallback(() => {
    const now = Date.now();
    // Evitar tocar muito frequentemente
    if (now - lastLowTimeSound.current > 1000) {
      playLowTimeSound();
      lastLowTimeSound.current = now;
    }
  }, []);

  return {
    playMatchFound,
    playMove,
    playCapture,
    playCheck,
    playGameEnd,
    playLowTime,
  };
}

export {
  playMatchFoundSound,
  playMoveSound,
  playCaptureSound,
  playCheckSound,
  playGameEndSound,
  playLowTimeSound,
};