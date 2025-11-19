/* ============================================
    FLASHCARD COMPONENT
    Reusable flashcard display with image and word
   ============================================ */

import React from 'react';
import './Flashcard.css';

export default function Flashcard({ word, image, isRecording }) {
    return (
        <div className={`flashcard ${isRecording ? 'recording' : ''}`}>
        <div className="flashcard-image-container">
            <img src={image} alt={word} className="flashcard-image" />
        </div>
        <h2 className="flashcard-word">{word}</h2>
        </div>
    );
}