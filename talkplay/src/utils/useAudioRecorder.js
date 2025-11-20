import { useState, useCallback, useRef } from 'react';

/**
 * Trim silence from the beginning and end of an audio blob
 * @param {Blob} audioBlob - The audio blob to trim
 * @param {number} silenceThreshold - RMS threshold below which is considered silence (default: 0.01)
 * @param {number} minSilenceDuration - Minimum silence duration in seconds to trim (default: 0.5)
 * @returns {Promise<Blob>} Promise that resolves to the trimmed audio blob
 */
const trimSilence = async (audioBlob, silenceThreshold = 0.01, minSilenceDuration = 0.5) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0); // Use first channel for analysis
    const sampleRate = audioBuffer.sampleRate;
    const minSilenceSamples = minSilenceDuration * sampleRate;

    const windowSize = Math.floor(sampleRate * 0.01); // 10ms windows
    const rmsValues = [];
    for (let i = 0; i < channelData.length; i += windowSize) {
        const window = channelData.slice(i, i + windowSize);
        const rms = Math.sqrt(window.reduce((sum, sample) => sum + sample * sample, 0) / window.length);
        rmsValues.push(rms);
    }

    let startIndex = 0;
    for (let i = 0; i < rmsValues.length; i++) {
        if (rmsValues[i] > silenceThreshold) {
            startIndex = i * windowSize;
            break;
        }
    }

    let endIndex = channelData.length;
    for (let i = rmsValues.length - 1; i >= 0; i--) {
        if (rmsValues[i] > silenceThreshold) {
            endIndex = Math.min(channelData.length, (i + 1) * windowSize);
            break;
        }
    }

    if (startIndex < minSilenceSamples) startIndex = 0;
    if (endIndex > channelData.length - minSilenceSamples) endIndex = channelData.length;

    const trimmedLength = endIndex - startIndex;
    if (trimmedLength <= 0) {
        audioContext.close();
        return audioBlob;
    }

    const trimmedBuffer = audioContext.createBuffer(audioBuffer.numberOfChannels, trimmedLength, sampleRate);
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const trimmedData = trimmedBuffer.getChannelData(channel);
        for (let i = 0; i < trimmedLength; i++) {
            trimmedData[i] = originalData[startIndex + i];
        }
    }

    const trimmedBlob = await bufferToBlob(trimmedBuffer, audioBlob.type);
    audioContext.close();
    return trimmedBlob;
};

/**
 * Convert AudioBuffer to Blob
 * @param {AudioBuffer} buffer - The audio buffer
 * @param {string} mimeType - The MIME type
 * @returns {Promise<Blob>} Promise that resolves to the blob
 */
const bufferToBlob = async (buffer, mimeType) => {
    const length = buffer.length * buffer.numberOfChannels;
    const arrayBuffer = new ArrayBuffer(44 + length * 2); // WAV header + data
    const view = new DataView(arrayBuffer);

    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);

    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
            view.setInt16(offset, sample * 0x7FFF, true);
            offset += 2;
        }
    }

    return new Blob([arrayBuffer], { type: mimeType });
};

/**
 * Custom hook for audio recording using MediaRecorder API
 * @returns {Object} Object containing recording functions and state
 * Example: const { isRecording, startRecording, stopRecording, audioUrl } = useAudioRecorder();
 */
export function useAudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [toast, setToast] = useState(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const showToast = useCallback((message, type = 'error', persistent = false) => {
        setToast({ message, type, persistent });
        if (!persistent) {
            setTimeout(() => setToast(null), 10000);
        }
    }, []);

    /**
     * Request microphone permission
     * @returns {Promise<boolean>} True if permission granted
     */
    const requestPermission = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setHasPermission(true);
            return true;
        } catch (error) {
            console.error('Error requesting microphone permission:', error);
            setHasPermission(false);
            if (error.name === 'NotAllowedError') {
                showToast(
                    "🎤 Uh-oh! I can't hear you! 🙉\n\nPlease call a grown-up to help!\n\n(Parents: Please enable microphone access in browser settings)", 
                    'error', 
                    true
                );
            } else if (error.name === 'NotFoundError') {
                showToast('🎤 Hmm, we can\'t find your microphone! 🔍 Make sure your computer has one plugged in!', 'error', true);
            } else {
                showToast('🎤 Oh no! We\'re having trouble with your microphone! 😅 Try unplugging and plugging it back in!', 'error', true);
            }
            return false;
        }
    }, [showToast]);

    /**
     * Start recording audio
     */
    const startRecording = useCallback(async () => {
        if (!hasPermission || !streamRef.current || streamRef.current.getTracks().some(track => track.readyState === 'ended')) {
            const permitted = await requestPermission();
            if (!permitted) return;
        }

        if (streamRef.current) {
            chunksRef.current = [];
            const mediaRecorder = new MediaRecorder(streamRef.current);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                try {
                    const trimmedBlob = await trimSilence(blob);
                    const url = URL.createObjectURL(trimmedBlob);
                    setAudioUrl(url);
                } catch (error) {
                    console.error('Error trimming silence:', error);
                    const url = URL.createObjectURL(blob);
                    setAudioUrl(url);
                    showToast('⚙️ Hmm, something technical got mixed up! 🧩 Ask a parent or teacher to help check the app!', 'error', true);
                }
                setIsRecording(false);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setToast(null);
        }
    }, [hasPermission, requestPermission, showToast]);

    /**
     * Stop recording audio
     */
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        }
    }, [isRecording]);

    /**
     * Clear the current toast
     */
    const clearToast = useCallback(() => {
        setToast(null);
    }, []);

    /**
     * Play the recorded audio
     */
    const playRecording = useCallback(() => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    }, [audioUrl]);

    return {
        isRecording,
        audioUrl,
        hasPermission,
        requestPermission,
        startRecording,
        stopRecording,
        playRecording,
        toast,
        clearToast,
        showToast
    };
}