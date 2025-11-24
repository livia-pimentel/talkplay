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
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            const isEdge = /Edg/.test(navigator.userAgent);
            const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
            const isFirefox = /Firefox/.test(navigator.userAgent);

            // Browser-specific settings
            if (isChrome) {
                utterance.rate = 0.8;
                utterance.pitch = 1.1;
            } else if (isEdge) {
                utterance.rate = 1.2;
                utterance.pitch = 1.5;
            } else if (isFirefox) {
                utterance.rate = 1.0;
                utterance.pitch = 1.1;
            } else {
                utterance.rate = 1.0;
                utterance.pitch = 1.1;
            }

            utterance.volume = 1;

            let availableVoices = voices;
            if (availableVoices.length === 0) {
                availableVoices = window.speechSynthesis.getVoices();
                if (availableVoices.length > 0) {
                    setVoices(availableVoices);
                }
            }

            if (availableVoices.length > 0) {
                let preferredVoice;

                if (isChrome) {
                    // Chrome: Use Google US English
                    preferredVoice = availableVoices.find(voice => 
                        voice.name.toLowerCase().includes('google us english')
                    ) || availableVoices.find(voice => 
                        voice.lang.startsWith('en-') && (
                            voice.name.toLowerCase().includes('female') || 
                            voice.name.toLowerCase().includes('samantha') ||
                            voice.name.toLowerCase().includes('zira')
                        )
                    ) || availableVoices.find(voice => voice.lang.startsWith('en-'))
                    || availableVoices[0];
                } else if (isEdge) {
                    // Edge: Use Microsoft female voices
                    preferredVoice = availableVoices.find(voice => {
                        const nameLower = voice.name.toLowerCase();
                        const isEnglish = voice.lang.startsWith('en-');
                        const isFemale = nameLower.includes('ava') ||
                                        nameLower.includes('emma') ||
                                        nameLower.includes('aria') ||
                                        nameLower.includes('jenny') ||
                                        nameLower.includes('michelle');
                        return isEnglish && isFemale;
                    });
                    
                    if (!preferredVoice) {
                        const englishFemales = availableVoices.filter(v => 
                            v.lang.startsWith('en-') && 
                            (v.name.toLowerCase().includes('natasha') ||
                             v.name.toLowerCase().includes('clara') ||
                             v.name.toLowerCase().includes('molly') ||
                             v.name.toLowerCase().includes('libby') ||
                             v.name.toLowerCase().includes('maisie') ||
                             v.name.toLowerCase().includes('emily'))
                        );
                        preferredVoice = englishFemales[0];
                    }
                    
                    if (!preferredVoice) {
                        preferredVoice = availableVoices.find(voice => voice.lang.startsWith('en-'))
                        || availableVoices[0];
                    }
                } else if (isFirefox) {
                    // Firefox: Use Microsoft Zira Desktop
                    preferredVoice = availableVoices.find(voice => 
                        voice.name.toLowerCase().includes('microsoft zira desktop')
                    ) || availableVoices.find(voice => 
                        voice.lang.startsWith('en-') && (
                            voice.name.toLowerCase().includes('zira') ||
                            voice.name.toLowerCase().includes('female')
                        )
                    ) || availableVoices.find(voice => voice.lang.startsWith('en-'))
                    || availableVoices[0];
                } else {
                    // Other browsers: Generic female voice selection
                    const femaleVoices = availableVoices.filter(voice => {
                        const nameLower = voice.name.toLowerCase();
                        const langMatch = voice.lang.startsWith('en-') || voice.lang === 'en';
                        const isFemale = nameLower.includes('female') || 
                                        nameLower.includes('woman') ||
                                        nameLower.includes('samantha') ||
                                        nameLower.includes('zira');
                        return isFemale && langMatch;
                    });

                    preferredVoice = femaleVoices.length > 0 
                        ? femaleVoices[0]
                        : availableVoices.find(v => v.lang.startsWith('en-') || v.lang === 'en')
                        || availableVoices[0];
                }

                utterance.voice = preferredVoice;
            }

            window.speechSynthesis.speak(utterance);
        } else {
            console.warn('Speech synthesis not supported in this browser');
        }
    }, [voices]);

    return { speak };
}