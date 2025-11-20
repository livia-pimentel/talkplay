/* ============================================
    TALKPLAY - SPEECH SYNTHESIS UTILITIES
    Custom hook for text-to-speech functionality
   ============================================ */

import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for speech synthesis using Web Speech API
 * @returns {Object} Object containing the speak function
 * Example: const { speak } = useSpeechSynthesis(); speak('Hello world');
 */
export function useSpeechSynthesis() {
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback((text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);

            utterance.rate = 0.8;
            utterance.pitch = 1.1;
            utterance.volume = 1;

            let availableVoices = voices;
            if (availableVoices.length === 0) {
                availableVoices = window.speechSynthesis.getVoices();
                if (availableVoices.length > 0) {
                    setVoices(availableVoices);
                }
            }

            if (availableVoices.length > 0) {
                const preferredVoice = availableVoices.find(voice => 
                    voice.name.toLowerCase().includes('female') || 
                    voice.name.toLowerCase().includes('samantha') ||
                    voice.name.toLowerCase().includes('zira') ||
                    voice.lang.startsWith('en-')
                ) || availableVoices[0];
                utterance.voice = preferredVoice;
            }

            window.speechSynthesis.speak(utterance);
        } else {
            console.warn('Speech synthesis not supported in this browser');
        }
    }, [voices]);

    return { speak };
}