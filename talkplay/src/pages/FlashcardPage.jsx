/* ============================================
    FLASHCARD PAGE COMPONENT
    Interactive flashcard practice page
   ============================================ */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { allFlashcards } from '../data/flashcards';
import { categories } from '../data/categories';
import { useSpeechSynthesis } from '../utils/useSpeechSynthesis';
import './FlashcardPage.css';

export default function FlashcardPage() {
    const { categoryId } = useParams();
    const { speak } = useSpeechSynthesis();
    
    // Get category info
    const category = categories.find(cat => cat.id === categoryId);
    
    // Filter flashcards for this category
    const categoryFlashcards = allFlashcards.filter(
        card => card.category === categoryId
    );
    
    // State
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [showEncouragement, setShowEncouragement] = useState(false);
    
    // Get current flashcard
    const currentCard = categoryFlashcards[currentWordIndex];
    
    // Calculate progress
    const progress = {
        current: currentWordIndex + 1,
        total: categoryFlashcards.length,
        percentage: Math.round(((currentWordIndex + 1) / categoryFlashcards.length) * 100)
    };
    
    // Navigation handlers
    const goToNext = () => {
    if (currentWordIndex < categoryFlashcards.length - 1) {
        setShowEncouragement(true); // Show encouragement when moving forward
        setCurrentWordIndex(currentWordIndex + 1);
        
        // Hide encouragement after 3 seconds
        setTimeout(() => {
        setShowEncouragement(false);
        }, 3000);
    }
    };

    const goToPrevious = () => {
    if (currentWordIndex > 0) {
        setShowEncouragement(false); // Hide when going back
        setCurrentWordIndex(currentWordIndex - 1);
    }       
    };

    // Handle keyboard navigation
    useEffect(() => {
    const handleKeyPress = (e) => {
        if (e.key === 'ArrowRight') {
        if (currentWordIndex < categoryFlashcards.length - 1) {
            setShowEncouragement(true);
            setCurrentWordIndex(currentWordIndex + 1);
            
            setTimeout(() => {
            setShowEncouragement(false);
            }, 3000);
        }
        }
        if (e.key === 'ArrowLeft') {
        if (currentWordIndex > 0) {
            setShowEncouragement(false);
            setCurrentWordIndex(currentWordIndex - 1);
        }
        }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentWordIndex, categoryFlashcards.length]);


    // Placeholder for audio functions (Amon will implement)
    const handleListen = () => {
        speak(currentCard.word);
    };
    
    const handleRecord = () => {
        setIsRecording(!isRecording);
        console.log('Record:', currentCard.word);
        // Amon's audio hook will go here
    };
    
    const handlePlay = () => {
        console.log('Play recording:', currentCard.word);
        // Amon's audio hook will go here
    };
    
    // If category doesn't exist or has no flashcards
    if (!category || categoryFlashcards.length === 0) {
        return (
        <div className="flashcard-page">
            <div className="flashcard-page-container">
            <Link to="/categories" className="back-button">
                ← Back to Categories
            </Link>
            <p>No flashcards found for this category.</p>
            </div>
        </div>
        );
    }
    
    return (
        <div className="flashcard-page">
        <div className="flashcard-page-container">
            
            {/* Header with Back button and Progress */}
            <div className="flashcard-header">
            <Link to="/categories" className="back-button">
                ← Back
            </Link>
            
            <div className="progress-bar-container">
                <div className="progress-label">
                Progress: {progress.current} of {progress.total} words completed
                </div>
                <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${progress.percentage}%` }}
                >
                    {progress.percentage}%
                </div>
                </div>
            </div>
            </div>
            
            {/* Main Flashcard */}
            <div className="flashcard-main">
            <Flashcard 
                word={currentCard.word}
                image={currentCard.image}
                isRecording={isRecording}
            />
            
            {/* Audio Control Buttons */}
            <div className="flashcard-controls">
                <div className="control-button-wrapper">
                <button 
                    className="control-button listen" 
                    onClick={handleListen}
                    aria-label="Listen to word pronunciation"
                >
                    🔊
                </button>
                <div className="control-label">Listen</div>
                </div>
                
                <div className="control-button-wrapper">
                <button 
                    className={`control-button record ${isRecording ? 'recording' : ''}`}
                    onClick={handleRecord}
                    aria-label="Record your voice"
                >
                    🎤
                </button>
                <div className="control-label">Record</div>
                </div>
                
                <div className="control-button-wrapper">
                <button 
                    className="control-button play" 
                    onClick={handlePlay}
                    aria-label="Play your recording"
                >
                    ▶️
                </button>
                <div className="control-label">Play</div>
                </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flashcard-navigation">
                <button 
                className="nav-button" 
                onClick={goToPrevious}
                disabled={currentWordIndex === 0}
                >
                ← Previous
                </button>
                <button 
                className="nav-button" 
                onClick={goToNext}
                disabled={currentWordIndex === categoryFlashcards.length - 1}
                >
                Next →
                </button>
            </div>
            
            {/* Encouragement Message - Show after completing a word */}
            {showEncouragement && (
                <div className="encouragement-message">
                    Amazing work! Keep going! 
                </div>
            )}
            </div>
            
        </div>
        </div>
    );
}