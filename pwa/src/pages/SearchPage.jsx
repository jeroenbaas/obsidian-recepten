import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChefHat } from 'lucide-react';
import Fuse from 'fuse.js';
import RecipeCard from '../components/RecipeCard';

export default function SearchPage({ recipes, currentRecipePath }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(recipes, {
      keys: ['title', 'tags', 'ingredients', 'category', 'content'],
      threshold: 0.3,
      includeScore: true
    });
  }, [recipes]);

  // Handle search
  useEffect(() => {
    if (!query) {
      setResults(recipes);
      return;
    }
    const searchResults = fuse.search(query).map(result => result.item);
    setResults(searchResults);
  }, [query, fuse, recipes]);

  return (
    <div className="sidebar">
      <div className="search-header">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Zoek recepten of ingrediënten..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="recipe-list">
        {results.length > 0 ? (
          results.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              isActive={recipe.url === `/recipes/${currentRecipePath}`}
            />
          ))
        ) : (
          <div className="empty-state">
            <ChefHat size={48} />
            <p style={{ marginTop: '1rem' }}>Geen recepten gevonden voor "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
