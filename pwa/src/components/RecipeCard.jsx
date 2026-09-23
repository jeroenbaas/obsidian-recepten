import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Users, ChefHat } from 'lucide-react';

export default function RecipeCard({ recipe, isActive }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Keep the current search query in URL when navigating
  const handleClick = () => {
    navigate(`/${recipe.id}${location.search}`);
  };

  return (
    <div 
      className={`recipe-card ${isActive ? 'active' : ''}`} 
      onClick={handleClick}
    >
      <h3>{recipe.title}</h3>
      <div className="recipe-meta">
        {recipe.time && (
          <span className="flex items-center gap-1" title="Bereidingstijd">
            <Clock size={14} /> {recipe.time}
          </span>
        )}
        {recipe.difficulty && (
          <span className="flex items-center gap-1" title="Moeilijkheid">
            <ChefHat size={14} /> {recipe.difficulty}
          </span>
        )}
        {recipe.category && (
          <span className="tag">{recipe.category}</span>
        )}
      </div>
    </div>
  );
}
