/* ============================================
    CELEBRATION MODAL COMPONENT
    Displays celebration when word is completed
   ============================================ */

import React, { useEffect, useState, startTransition } from 'react';
import '../styles/CelebrationModal.css';

const celebrationMessages = [
    "🌟 Super Star! 🌟",
    "🎉 Amazing Job! 🎉",
    "✨ You're Brilliant! ✨",
    "🚀 Fantastic Work! 🚀",
    "🎨 You Did It! 🎨",
    "💫 Wonderful! 💫",
    "🏆 Champion! 🏆",
    "🎪 Incredible! 🎪"
];

export default function CelebrationModal({ show, onClose }) {
    const [randomMessage, setRandomMessage] = useState("");
    const [confettiPositions, setConfettiPositions] = useState([]);

    useEffect(() => {
        if (show) {
            // Wrap state updates in startTransition to avoid cascading render warnings
            startTransition(() => {
            // Generate random message
            setRandomMessage(celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]);
            
            // Generate 20 confetti instead of 30
            setConfettiPositions(
                [...Array(20)].map(() => ({
                    left: 10 + Math.random() * 80,
                    delay: Math.random() * 0.5
                }))
            );
        });
            
            // Auto-close after 3 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="celebration-overlay" onClick={onClose}>
            <div className="celebration-modal" onClick={(e) => e.stopPropagation()}>
                <button className="celebration-close" onClick={onClose} aria-label="Close">
                    ✕
                </button>
                <div className="celebration-content">
                    <h2 className="celebration-message">{randomMessage}</h2>
                    <div className="celebration-subtext">Keep up the great work!</div>
                </div>
                    
                {/* Confetti particles */}
                <div className="confetti-container">
                    {confettiPositions.map((pos, i) => (
                        <div 
                            key={i} 
                            className="confetti" 
                            style={{
                                left: `${pos.left}%`,
                                animationDelay: `${pos.delay}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}