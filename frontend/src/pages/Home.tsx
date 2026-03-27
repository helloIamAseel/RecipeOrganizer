import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import RecipeCard, { type Recipe } from '../components/RecipeCard';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const categories = [
    { key: 'All', label: t.all },
    { key: 'Breakfast', label: t.breakfast },
    { key: 'Lunch', label: t.lunch },
    { key: 'Dinner', label: t.dinner },
    { key: 'Dessert', label: t.dessert },
    { key: 'Snack', label: t.snack },
    { key: 'Drink', label: t.drink },
    { key: 'Other', label: t.other },
  ];

  async function fetchRecipes() {
    const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setRecipes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe)));
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await fetchRecipes();
    })();
  }, []);
  
  const filtered = recipes.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || r.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-serif font-bold text-[#a54d2a] mb-3">{t.discoverTitle}</h1>
        <p className="text-[#a54d2a]/70 text-lg">{t.discoverSubtitle}</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="flex-1 px-4 py-3 border-2 border-[#a54d2a] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#a54d2a]/30 font-serif"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border-2 ${
              category === cat.key
                ? 'bg-[#a54d2a] text-white border-[#a54d2a]'
                : 'bg-white text-[#a54d2a] border-[#a54d2a] hover:bg-[#ffeaad]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center text-[#a54d2a] text-xl font-serif animate-pulse py-20">{t.loadingRecipes}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🍽️</p>
          <p className="text-[#a54d2a] text-xl font-serif">{t.noRecipes}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onLikeToggle={fetchRecipes} />
          ))}
        </div>
      )}
    </main>
  );
}