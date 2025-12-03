/* ============================================
    HOME PAGE COMPONENT
    Category selection screen
   ============================================ */

import React from 'react';
import CategoryCard from '../components/CategoryCard';
import '../styles/Home.css';
import { categories } from '../data/categories';

export default function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <div className="home-logo">
                    <img src="/talkplay-logo.svg" alt="TalkPlay Logo" />
                </div>
                <h1 className="home-title">TalkPlay</h1>
                <p className="home-subtitle">Choose a category to practice!</p>
            </header>
            
            <div className="category-grid">
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </div>
    );
}