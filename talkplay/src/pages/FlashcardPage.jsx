/* ============================================
    FLASHCARD PAGE COMPONENT
    Interactive flashcard practice page
   ============================================ */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { allFlashcards } from '../data/flashcards';
import { categories } from '../data/categories';
import { useSpeechSynthesis } from '../utils/useSpeechSynthesis';
import { useAudioRecorder } from '../utils/useAudioRecorder';
import './FlashcardPage.css';

export default function FlashcardPage() {
    const { categoryId } = useParams();
    const { speak } = useSpeechSynthesis();
    const { isRecording, startRecording, stopRecording, audioUrl, toast, clearToast, showToast } = useAudioRecorder();
    
    // Get category info
    const category = categories.find(cat => cat.id === categoryId);
    
    // Filter flashcards for this category
    const categoryFlashcards = allFlashcards.filter(
        card => card.category === categoryId
    );
    
    // State
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showEncouragement, setShowEncouragement] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [waveAnimation, setWaveAnimation] = useState({ type: null, direction: null });
    const audioRef = useRef(null);
    
    const triggerWave = (type, direction) => {
        setWaveAnimation({ type, direction });
        setTimeout(() => setWaveAnimation({ type: null, direction: null }), 400);
    };
    
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

    // Stop recording when clicking outside the record button
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isRecording && !e.target.closest('.control-button.record')) {
                stopRecording();
                triggerWave('record', 'inward');
            }
        };

        if (isRecording) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isRecording, stopRecording]);
    
    useEffect(() => {
        if (isPlaying) {
            triggerWave('play', 'outward');
        }
    }, [isPlaying]);

    const handleListen = async () => {
        triggerWave('listen', 'outward');
        
        if (!('speechSynthesis' in window)) {
            showToast('🔊 Uh oh! Your browser doesn\'t have a voice! 🤷 Try using Chrome, Firefox, or Safari!');
            return;
        }
        speak(currentCard.word);
    };
    
    const handleRecord = async () => {
        if (isRecording) {
            stopRecording();
            triggerWave('record', 'inward');
        } else {
            await startRecording();
        }
    };
    
    const handlePlay = async () => {
        // If currently playing, stop playback
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            triggerWave('play', 'inward');
            return;
        }

        // If currently recording, stop recording first
        if (isRecording) {
            stopRecording();
            triggerWave('record', 'inward');

            await new Promise(resolve => {
                const checkAudio = () => {
                    if (audioUrl) {
                        resolve();
                    } else {
                        setTimeout(checkAudio, 50);
                    }
                };
                setTimeout(checkAudio, 100);
            });
        }

        if (!audioUrl) {
            showToast('▶️ Whoops! There\'s nothing to play yet! 🎵 Try recording yourself first!');
            return;
        }
        try {
            setIsPlaying(true);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;
            
            audio.onended = () => {
                setIsPlaying(false);
                triggerWave('play', 'inward');
            };
            
            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                setIsPlaying(false);
                showToast('▶️ Oops! The sound got tangled up! 🎪 Ask a grown-up to help if it keeps happening!');
            };
            
            await audio.play();
        } catch (error) {
            console.error('Playback error:', error);
            setIsPlaying(false);
            showToast('▶️ Uh oh! Something went wonky! 🎨 Ask a parent or teacher to help troubleshoot!');
        }
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
                <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${progress.percentage}%` }}
                >
                    {progress.percentage}%
                </div>
                </div>
                <div className="progress-label">
                Progress: {progress.current} of {progress.total} words completed
                </div>
            </div>
            </div>
            
            {/* Main Flashcard */}
            <div className="flashcard-main">
            <Flashcard 
                word={currentCard.word}
                image={currentCard.image}
                isRecording={isRecording}
                isPlaying={isPlaying}
                waveAnimation={waveAnimation}
            />
            
            {/* Audio Control Buttons */}
            <div className="flashcard-controls">
                <div className="control-button-wrapper">
                <button 
                    className={`control-button listen ${waveAnimation.type === 'listen' && waveAnimation.direction === 'outward' ? 'wave-outward' : ''}`}
                    onClick={handleListen}
                    aria-label="Listen to word pronunciation"
                >
                    🔊
                </button>
                <div className="control-label">Listen</div>
                </div>
                
                <div className="control-button-wrapper">
                <button 
                    className={`control-button record ${isRecording ? 'recording' : ''} ${waveAnimation.type === 'record' && waveAnimation.direction === 'inward' ? 'wave-inward' : ''}`}
                    onClick={handleRecord}
                    aria-label="Record your voice"
                >
                    {isRecording ? '⏹️' : '🎤'}
                </button>
                <div className="control-label">Record</div>
                </div>
                
                <div className="control-button-wrapper">
                <button 
                    className={`control-button play ${isRecording ? 'disabled-hover' : ''} ${isPlaying ? 'playing' : ''} ${waveAnimation.type === 'play' && waveAnimation.direction === 'outward' ? 'wave-outward' : ''} ${waveAnimation.type === 'play' && waveAnimation.direction === 'inward' ? 'wave-inward' : ''}`}
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

            {/* Toast Notification */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    <div className="toast-content">
                        {toast.message}
                    </div>
                    {toast.persistent && (
                        <button 
                            className="toast-close"
                            onClick={clearToast}
                            aria-label="Close notification"
                        >
                            ✕
                        </button>
                    )}
                </div>
            )}
            </div>
            
        </div>
        </div>
    );
}