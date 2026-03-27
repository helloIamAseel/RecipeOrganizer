import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import RecipeCard, { type Recipe } from '../components/RecipeCard';
import { useLanguage } from '../context/LanguageContext';

export default function Favorites() {
  const { user } = useAuthState();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  async function fetchFavorites() {
    if (!user) return;
    const snap = await getDocs(query(collection(db, 'recipes')));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
    setRecipes(all.filter(r => r.likes?.includes(user.uid)));
    setLoading(false);
  }

  useEffect(() => { fetchFavorites(); }, [user]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold text-[#a54d2a] mb-8">{t.favorites}</h1>

      {loading ? (
        <div className="text-center text-[#a54d2a] animate-pulse py-20 font-serif text-xl">{t.loading}</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🤍</p>
          <p className="text-[#a54d2a] text-xl font-serif">{t.noFavorites}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onLikeToggle={fetchFavorites} />
          ))}
        </div>
      )}
    </main>
  );
}