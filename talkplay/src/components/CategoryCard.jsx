/* ============================================
    CATEGORYCARD COMPONENT
    Reusable card for category selection
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryCompletion } from '../utils/storage';
import '../styles/CategoryCard.css';

    export default function CategoryCard({ category }) {
        const { id, name, icon } = category;
        const { percentage } = getCategoryCompletion(id, 10);
    
    return (
        <Link to={`/category/${id}`} className="category-card-link">
        <div className={`category-card ${id}`}>
            <div className="progress-badge">{percentage}%</div>
            <div className="category-icon">
                <img src={icon} alt={name} />
            </div>
            <h3 className="category-title">{name}</h3>
        </div>
        </Link>
    );
}