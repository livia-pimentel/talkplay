import React from "react";
import { useParams } from 'react-router-dom';

export default function FlashcardPage() {
    const { categoryId } = useParams();

    return <h2>Flashcards Page of the Category: { categoryId }</h2>
}