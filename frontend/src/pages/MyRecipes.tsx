import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import RecipeCard, { type Recipe } from '../components/RecipeCard';
import { Link } from 'react-router-dom';

export default function MyRecipes() {
  const { user } = useAuthState();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMyRecipes() {
    if (!user) return;
    const q = query(collection(db, 'recipes'), where('authorId', '==', user.uid));
    const snap = await getDocs(q);
    setRecipes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe)));
    setLoading(false);
  }

  useEffect(() => { fetchMyRecipes(); }, [user]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this recipe?')) return;
    await deleteDoc(doc(db, 'recipes', id));
    fetchMyRecipes();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#a54d2a]">My Recipes</h1>
        <Link
          to="/add-recipe"
          className="px-5 py-2 bg-[#a54d2a] text-white rounded-lg font-semibold hover:bg-[#c76139] transition-colors"
        >
          + Add Recipe
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-[#a54d2a] animate-pulse py-20 font-serif text-xl">Loading...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">👨‍🍳</p>
          <p className="text-[#a54d2a] text-xl font-serif mb-4">You haven't added any recipes yet!</p>
          <Link to="/add-recipe" className="px-6 py-3 bg-[#a54d2a] text-white rounded-lg font-semibold hover:bg-[#c76139]">
            Add Your First Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
             <RecipeCard 
             key={recipe.id} 
             recipe={recipe} 
             onLikeToggle={fetchMyRecipes}
             onDelete={() => handleDelete(recipe.id)}
             />
          ))}
        </div>
      )}
    </main>
  );
}
