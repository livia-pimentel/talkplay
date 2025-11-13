/* ============================================
    CATEGORYCARD COMPONENT
    Reusable card for category selection
   ============================================ */

import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

    export default function CategoryCard({ category }) {
        const { id, name, icon, gradient: _gradient } = category;  // Prefixed with _ to avoid unused variable warning
    
    return (
        <Link to={`/category/${id}`} className="category-card-link">
        <div className={`category-card ${id}`}>
            <div className="category-icon">
            {icon}
            </div>
            <h3 className="category-title">{name}</h3>
        </div>
        </Link>
    );
}