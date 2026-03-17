import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { type Recipe } from '../components/RecipeCard';
import RecipeCard from '../components/RecipeCard';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetch() {
      if (!id) return;
      const snap = await getDoc(doc(db, 'recipes', id));
      if (snap.exists()) {
        setRecipe({ id: snap.id, ...snap.data() } as Recipe);
      }
      setLoading(false);
    }
    fetch();
  }, [id]);

  async function refetch() {
    if (!id) return;
    const snap = await getDoc(doc(db, 'recipes', id));
    if (snap.exists()) setRecipe({ id: snap.id, ...snap.data() } as Recipe);
  }

  if (loading) return <div className="text-center py-20 text-[#a54d2a] font-serif text-xl animate-pulse">Loading...</div>;
  if (!recipe) return <div className="text-center py-20 text-[#a54d2a] font-serif text-xl">Recipe not found.</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-[#a54d2a] font-semibold mb-6 hover:underline">← Back</button>

      <div className="bg-[#fff8e4] border-2 border-[#a54d2a] rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-serif font-bold text-[#a54d2a]">{recipe.title}</h1>
          <span className="text-sm bg-[#ffeaad] text-[#a54d2a] px-3 py-1 rounded-full font-medium">{recipe.category}</span>
        </div>

        <p className="text-gray-500 mb-6">⏱ {recipe.prepTime} min · by {recipe.authorName}</p>

        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-[#a54d2a] mb-2">Ingredients</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{recipe.ingredients}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-serif font-bold text-[#a54d2a] mb-2">Instructions</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{recipe.instructions}</p>
        </section>

        {recipe.notes && (
          <section className="mb-6 bg-[#ffeaad]/50 rounded-lg p-4">
            <h2 className="text-xl font-serif font-bold text-[#a54d2a] mb-2">Notes & Tips</h2>
            <p className="text-gray-700 whitespace-pre-line">{recipe.notes}</p>
          </section>
        )}

        <div className="border-t border-[#a54d2a]/20 pt-4 mt-4">
          <RecipeCard recipe={recipe} onLikeToggle={refetch} />
        </div>
      </div>
    </main>
  );
}
