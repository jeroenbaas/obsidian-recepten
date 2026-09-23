import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import RecipePage from './pages/RecipePage';
import { ChefHat } from 'lucide-react';

function AppContent() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the generated recipes index
    fetch(`${import.meta.env.BASE_URL}recipes_index.json`)
      .then(res => res.json())
      .then(data => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load recipes index", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ChefHat size={48} className="text-muted" style={{ animation: 'pulse 2s infinite' }} />
        <p className="text-muted" style={{ marginTop: '1rem' }}>Recepten laden...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Left Sidebar: Search & List */}
        <SearchPage recipes={recipes} />
        
        {/* Right Area: Detail View */}
        <Routes>
          <Route path="/" element={
            <div className="recipe-detail hidden-mobile">
              <div className="empty-state">
                <ChefHat size={64} />
                <h2>Selecteer een recept</h2>
                <p>Kies een recept uit de lijst of zoek naar ingrediënten.</p>
              </div>
            </div>
          } />
          <Route path="/recipe/*" element={
            <RecipePage recipes={recipes} />
          } />
          <Route path="/recipes/*" element={
            <RecipePage recipes={recipes} />
          } />
          <Route path="/*" element={
            <RecipePage recipes={recipes} />
          } />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
