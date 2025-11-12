import { useEffect, useRef } from 'react';
import { Alert, Settings } from '@/models/device.model';

type SoundType = 'beep' | 'chime' | 'siren';

export const useAlertSound = (alerts: Alert[], settings: Settings) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false);

  // Initialize AudioContext on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!userInteractedRef.current) {
        userInteractedRef.current = true;
      }
    };

    // Listen for any user interaction to enable audio
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, []);

  useEffect(() => {
    const activeAlerts = alerts.filter(a => a.active);
    const hasCriticalAlerts = activeAlerts.some(a => a.severity === 'critical');
    const hasWarningAlerts = activeAlerts.some(a => a.severity === 'warning');

    if ((hasCriticalAlerts || hasWarningAlerts) && !isPlayingRef.current && userInteractedRef.current) {
      // Start playing alert sound with appropriate sound type
      const soundType = hasCriticalAlerts ? settings.criticalSound : settings.warningSound;
      startAlertSound(soundType, hasCriticalAlerts);
      isPlayingRef.current = true;
    } else if (activeAlerts.length === 0 && isPlayingRef.current) {
      // Stop playing alert sound
      stopAlertSound();
      isPlayingRef.current = false;
    }

    return () => {
      stopAlertSound();
    };
  }, [alerts, settings]);

  const startAlertSound = (soundType: SoundType, isCritical: boolean) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const audioContext = audioContextRef.current;

      // Create oscillator for sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure sound based on type
      if (soundType === 'beep') {
        oscillator.frequency.value = isCritical ? 880 : 440;
        oscillator.type = 'sine';
      } else if (soundType === 'chime') {
        oscillator.frequency.value = isCritical ? 1046.5 : 523.25; // C6 or C5
        oscillator.type = 'sine';
      } else if (soundType === 'siren') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 400;
      }

      // Set volume
      gainNode.gain.value = 0.3;

      // Create pulsing effect
      const now = audioContext.currentTime;
      const pulseDuration = soundType === 'siren' ? 0.5 : (isCritical ? 0.2 : 0.3);
      const pauseDuration = soundType === 'siren' ? 0.5 : (isCritical ? 0.2 : 0.5);

      const pulse = () => {
        if (!isPlayingRef.current) return;

        const currentTime = audioContext.currentTime;
        
        if (soundType === 'siren') {
          // Siren effect: sweep frequency up and down
          oscillator.frequency.setValueAtTime(400, currentTime);
          oscillator.frequency.linearRampToValueAtTime(800, currentTime + pulseDuration);
          
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0.3, currentTime + pulseDuration);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + pulseDuration + 0.05);
        } else if (soundType === 'chime') {
          // Chime effect: quick fade in and slow fade out
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(0.4, currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + pulseDuration);
        } else {
          // Beep effect: standard pulse
          gainNode.gain.setValueAtTime(0, currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.05);
          gainNode.gain.linearRampToValueAtTime(0.3, currentTime + pulseDuration);
          gainNode.gain.linearRampToValueAtTime(0, currentTime + pulseDuration + 0.05);
        }

        timeoutRef.current = setTimeout(pulse, (pulseDuration + pauseDuration) * 1000);
      };

      oscillator.start(now);
      pulse();

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
    } catch (error) {
      console.error('Error starting alert sound:', error);
    }
  };

  const stopAlertSound = () => {
    try {
      // Clear any pending pulse timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping alert sound:', error);
    }
  };
};
