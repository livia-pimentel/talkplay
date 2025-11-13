/* ============================================
    HOME PAGE COMPONENT
    Category selection screen
   ============================================ */

import React from 'react';
import CategoryCard from '../components/CategoryCard';
import './Home.css';

// TEMPORARY: Mock data until Livia creates the actual categories.js file
const mockCategories = [
    {
        id: 'animals',
        name: 'Animals',
        icon: '🦁',
        gradient: ['#FFBE0B', '#FB5607']
    },
    {
        id: 'foods',
        name: 'Foods',
        icon: '🍎',
        gradient: ['#06FFA5', '#06D6A0']
    },
    {
        id: 'toys',
        name: 'Toys',
        icon: '🧸',
        gradient: ['#8338EC', '#FF006E']
    }
];

export default function Home() {
    return (
        <div className="home-container">
        <header className="home-header">
            <h1 className="home-title">TalkPlay</h1>
            <p className="home-subtitle">Choose a category to practice!</p>
        </header>
        
        <div className="category-grid">
            {mockCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
            ))}
        </div>
        </div>
    );
}

/* 
TODO: Once Livia creates src/data/categories.js, replace mockCategories with:
import { categories } from '../data/categories';
*/