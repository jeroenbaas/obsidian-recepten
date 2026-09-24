import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChefHat } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';
import RecipeCard from '../components/RecipeCard';

export default function SearchPage({ recipes }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const location = useLocation();

  // Extract active recipe ID from current URL
  const activeRecipeId = useMemo(() => {
    const raw = location.pathname || '';
    const decoded = decodeURIComponent(raw);
    return decoded
      .replace(/^\/?(recipe\/|recipes\/)?/, '')
      .replace(/\.md$/, '')
      .trim();
  }, [location.pathname]);

  // Initialize Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(recipes, {
      keys: ['title', 'tags', 'ingredients', 'category', 'cuisine', 'content'],
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 2,
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
          results.map(recipe => {
            const cleanId = (recipe.id || '').replace(/^\/?(recipe\/|recipes\/)?/, '').replace(/\.md$/, '').trim();
            const isActive = !!activeRecipeId && cleanId === activeRecipeId;
            return (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isActive={isActive}
              />
            );
          })
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
