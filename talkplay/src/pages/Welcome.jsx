/* ============================================
    WELCOME PAGE COMPONENT - ENHANCED
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Welcome.css';

export default function Welcome() {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                
                {/* Logo Section */}
                <div className="welcome-logo-section">
                    <img src="/talkplay-logo.svg" alt="TalkPlay Logo" className="welcome-logo" />
                    <h1 className="welcome-title">TalkPlay</h1>
                    <p className="welcome-tagline">Speech Practice Made Fun! 🎉</p>
                </div>

                {/* Call to Action Button */}
                <Link to="/categories" className="start-button">
                    Let's Play!
                </Link>

                {/* Subtitle */}
                <p className="welcome-subtitle">
                    Practice words with colorful pictures and fun sounds!
                </p>
            </div>

            {/* Floating Icons */}
            <div className="floating-icons">
                <span className="floating-icon">🦁</span>
                <span className="floating-icon">🍎</span>
                <span className="floating-icon">🎨</span>
                <span className="floating-icon">🔊</span>
                <span className="floating-icon">⭐</span>
                <span className="floating-icon">🎤</span>
            </div>

            {/* Sparkles */}
            <div className="sparkles">
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
                <div className="sparkle"></div>
            </div>

            {/* Animated Background Bubbles */}
            <div className="background-bubbles">
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
                <div className="bubble bubble-4"></div>
                <div className="bubble bubble-5"></div>
            </div>
        </div>
    );
}