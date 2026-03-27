import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import RecipeCard, { type Recipe } from '../components/RecipeCard';
import { useLanguage } from '../context/LanguageContext';

export default function WeeklyHighlights() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  async function fetchTop() {
    const snap = await getDocs(collection(db, 'recipes'));
    const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
    // Sort by likes count, take top 6
    const sorted = all.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 6);
    setRecipes(sorted);
    setLoading(false);
  }

  useEffect(() => { fetchTop(); }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-[#a54d2a] mb-2">🏆 {t.weeklyTitle}</h1>
        <p className="text-[#a54d2a]/70 text-lg">{t.weeklySubtitle}</p>
      </div>

      {loading ? (
        <div className="text-center text-[#a54d2a] animate-pulse py-20 font-serif text-xl">{t.loading}</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🍽️</p>
          <p className="text-[#a54d2a] text-xl font-serif">{t.noRecipes}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, i) => (
            <div key={recipe.id} className="relative">
              {i < 3 && (
                <div className="absolute -top-3 -start-3 z-10 bg-[#a54d2a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  #{i + 1}
                </div>
              )}
              <RecipeCard recipe={recipe} onLikeToggle={fetchTop} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}