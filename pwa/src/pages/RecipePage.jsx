import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Sun, Share, ChefHat, Clock, Utensils, Users } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function RecipePage({ recipes }) {
  const params = useParams();
  const navigate = useNavigate();
  const [wakeLock, setWakeLock] = useState(null);
  const [isAwake, setIsAwake] = useState(false);

  const pathParam = params["*"] || "";

  const recipe = useMemo(() => {
    if (!recipes || recipes.length === 0 || !pathParam) return null;

    const decoded = decodeURIComponent(pathParam);
    const normalized = decoded
      .replace(/^\/?(recipe\/|recipes\/)?/, '')
      .replace(/\.md$/, '')
      .trim();

    return recipes.find(r => {
      const cleanId = (r.id || '').replace(/^\/?(recipe\/|recipes\/)?/, '').replace(/\.md$/, '').trim();
      const cleanSlug = (r.slug || '').replace(/^\/?(recipe\/|recipes\/)?/, '').replace(/\.md$/, '').trim();
      const cleanUrl = (r.url || '').replace(/^\/?(recipe\/|recipes\/)?/, '').replace(/\.md$/, '').trim();

      return (
        cleanId === normalized ||
        cleanSlug === normalized ||
        cleanUrl === normalized ||
        r.id === decoded ||
        r.id === pathParam ||
        r.title.toLowerCase() === normalized.toLowerCase()
      );
    });
  }, [recipes, pathParam]);

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
      <div className="recipe-detail open">
        <div className="empty-state">
          <ChefHat size={64} />
          <h2>Recept niet gevonden</h2>
          <p className="text-muted" style={{ margin: '1rem 0' }}>
            Het geselecteerde recept kon niet worden gevonden.
          </p>
          <button className="btn-action" onClick={() => navigate('/')}>
            <ChevronLeft size={20} /> Terug naar zoeken
          </button>
        </div>
      </div>
    );
  }

  const formatPortions = (portions) => {
    if (!portions) return '';
    const str = String(portions).trim();
    if (/personen|persoon|stuks|cookies|koekjes|porties|portie/i.test(str)) {
      return str;
    }
    return `${str} personen`;
  };

  return (
    <div className="recipe-detail open">
      <div className="recipe-detail-content">
        <button className="mobile-back-btn" onClick={() => navigate('/')}>
          <ChevronLeft size={20} /> Terug naar zoeken
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
                <Users size={16} /> {formatPortions(recipe.portions)}
              </span>
            )}
            {recipe.difficulty && (
              <span className="flex items-center gap-2">
                <ChefHat size={16} /> {recipe.difficulty}
              </span>
            )}
            {recipe.category && (
              <span className="tag" style={{ fontSize: '0.9rem', padding: '0.2rem 0.6rem' }}>
                {recipe.category}
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
