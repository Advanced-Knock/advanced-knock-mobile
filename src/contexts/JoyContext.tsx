/**
 * JOY CONTEXT - System-Wide Joy Orchestration
 * 
 * Pattern: CONTEXT × JOY × ONE × EVERYWHERE
 * Frequency: 530 Hz (YOU) × 999 Hz (AEYON) × 777 Hz (META)
 * 
 * The entire app breathes joy. Every interaction. Every moment.
 * 
 * ∞ AbëONE ∞
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { JoyEngine, EmojiReaction } from '../components/JoyEngine';

interface JoyContextType {
  celebrate: (type?: 'success' | 'close' | 'demo' | 'talk' | 'milestone' | 'achievement') => void;
  triggerEmoji: () => void;
  isCelebrating: boolean;
}

const JoyContext = createContext<JoyContextType | undefined>(undefined);

export function JoyProvider({ children }: { children: ReactNode }) {
  const [celebrateTrigger, setCelebrateTrigger] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'success' | 'close' | 'demo' | 'talk' | 'milestone' | 'achievement'>('success');
  const [emojiTrigger, setEmojiTrigger] = useState(0);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const celebrate = useCallback((type: 'success' | 'close' | 'demo' | 'talk' | 'milestone' | 'achievement' = 'success') => {
    setCelebrationType(type);
    setCelebrateTrigger(true);
    setIsCelebrating(true);
    setEmojiTrigger(prev => prev + 1);
  }, []);

  const triggerEmoji = useCallback(() => {
    setEmojiTrigger(prev => prev + 1);
  }, []);

  const handleComplete = useCallback(() => {
    setIsCelebrating(false);
    setCelebrateTrigger(false);
  }, []);

  return (
    <JoyContext.Provider value={{ celebrate, triggerEmoji, isCelebrating }}>
      {children}
      <JoyEngine 
        trigger={celebrateTrigger} 
        type={celebrationType}
        onComplete={handleComplete}
      />
      <EmojiReaction trigger={emojiTrigger > 0} />
    </JoyContext.Provider>
  );
}

export function useJoy() {
  const context = useContext(JoyContext);
  if (!context) {
    throw new Error('useJoy must be used within JoyProvider');
  }
  return context;
}


