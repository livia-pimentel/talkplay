/* ============================================
    FLASHCARD COMPONENT
    Reusable flashcard display with image and word
   ============================================ */

import React from 'react';
import './Flashcard.css';

export default function Flashcard({ word, image, isRecording, isPlaying, waveAnimation }) {
    const getWaveClass = () => {
        if (!waveAnimation || !waveAnimation.type) return '';
        
        const { type, direction } = waveAnimation;
        
        if (type === 'record') {
            return direction === 'inward' ? 'wave-inward-record' : '';
        }
        if (type === 'play') {
            return direction === 'outward' ? 'wave-outward-play' : 'wave-inward-play';
        }
        if (type === 'listen') {
            return direction === 'outward' ? 'wave-outward-listen' : '';
        }
        return '';
    };
    
    return (
        <div className={`flashcard ${isRecording ? 'recording' : ''} ${isPlaying ? 'playing' : ''} ${getWaveClass()}`}>
        <div className="flashcard-image-container">
            <img src={image} alt={word} className="flashcard-image" />
        </div>
        <h2 className="flashcard-word">{word}</h2>
        </div>
    );
}