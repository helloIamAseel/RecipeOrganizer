import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import { useNavigate } from 'react-router-dom';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'];

export default function AddRecipe() {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', ingredients: '', instructions: '',
    notes: '', prepTime: '', category: 'Dinner',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'recipes'), {
        ...form,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        likes: [],
        createdAt: Date.now(),
      });
      navigate('/my-recipes');
    } catch {
      setError('Failed to save recipe. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold text-[#a54d2a] mb-8">Add a New Recipe</h1>

      <form onSubmit={handleSubmit} className="bg-[#fff8e4] border-2 border-[#a54d2a] rounded-xl p-6 flex flex-col gap-5">

        <div>
          <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Recipe Title *</label>
          <input
            name="title" value={form.title} onChange={handleChange}
            placeholder="e.g. Spaghetti Bolognese"
            className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Prep Time (minutes) *</label>
            <input
              name="prepTime" value={form.prepTime} onChange={handleChange}
              type="number" placeholder="e.g. 30"
              className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Category *</label>
            <select
              name="category" value={form.category} onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a] bg-white"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Ingredients *</label>
          <textarea
            name="ingredients" value={form.ingredients} onChange={handleChange}
            rows={4} placeholder="e.g. 1 cup flour, 2 eggs..."
            className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a] resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Instructions *</label>
          <textarea
            name="instructions" value={form.instructions} onChange={handleChange}
            rows={5} placeholder="Step-by-step instructions..."
            className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a] resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Notes & Tips</label>
          <textarea
            name="notes" value={form.notes} onChange={handleChange}
            rows={3} placeholder="Optional tips or serving suggestions..."
            className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a] resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit" disabled={loading}
            className="flex-1 bg-[#a54d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#c76139] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Recipe'}
          </button>
          <button
            type="button" onClick={() => navigate(-1)}
            className="px-6 py-3 border-2 border-[#a54d2a] text-[#a54d2a] rounded-lg font-semibold hover:bg-[#ffeaad] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
