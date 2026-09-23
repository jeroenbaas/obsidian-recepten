import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, Share, ChefHat, Clock, Utensils } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function RecipePage({ recipes, toggleTheme, isDark }) {
  const { "*": path } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [wakeLock, setWakeLock] = useState(null);
  const [isAwake, setIsAwake] = useState(false);

  useEffect(() => {
    if (recipes.length > 0 && path) {
      // Find the recipe by matching the URL path
      const found = recipes.find(r => r.url === `/recipes/${path}`);
      setRecipe(found);
    }
  }, [recipes, path]);

  // Screen Wake Lock API for "Keep screen awake" feature
  const toggleWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        if (wakeLock) {
          await wakeLock.release();
          setWakeLock(null);
          setIsAwake(false);
        } else {
          const wl = await navigator.wakeLock.request('screen');
          setWakeLock(wl);
          setIsAwake(true);
          
          wl.addEventListener('release', () => {
            setIsAwake(false);
            setWakeLock(null);
          });
        }
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    } else {
      alert('Screen Wake Lock API not supported in this browser.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.title || 'Recept',
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Link gekopieerd!');
    }
  };

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <div className="empty-state">
          <ChefHat />
          <h2>Recept niet gevonden</h2>
          <button className="mobile-back-btn" onClick={() => navigate('/')}>
            <ChevronLeft size={20} /> Terug naar zoeken
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail open">
      <div className="recipe-detail-content">
        <button className="mobile-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} /> Terug
        </button>
        
        <div className="recipe-header">
          <h1>{recipe.title}</h1>
          
          <div className="recipe-meta" style={{ fontSize: '1rem', gap: '1rem' }}>
            {recipe.time && (
              <span className="flex items-center gap-2">
                <Clock size={16} /> {recipe.time}
              </span>
            )}
            {recipe.portions && (
              <span className="flex items-center gap-2">
                <Users size={16} /> {recipe.portions} personen
              </span>
            )}
            {recipe.difficulty && (
              <span className="flex items-center gap-2">
                <ChefHat size={16} /> {recipe.difficulty}
              </span>
            )}
          </div>
          
          <div className="recipe-actions">
            <button 
              className={`btn-action ${isAwake ? 'active' : ''}`}
              onClick={toggleWakeLock}
              title="Houd het scherm aan tijdens het koken"
            >
              {isAwake ? <Sun size={18} /> : <Moon size={18} />}
              Scherm aanhouden
            </button>
            <button className="btn-action" onClick={handleShare}>
              <Share size={18} />
              Delen
            </button>
          </div>
        </div>

        <MarkdownRenderer content={recipe.content} />
      </div>
    </div>
  );
}
