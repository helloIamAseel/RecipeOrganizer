import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'] as const;

export default function EditRecipe() {
  const { user } = useAuthState();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [form, setForm] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    notes: '',
    prepTime: '',
    category: 'Dinner',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    async function fetchRecipe() {
      if (!id) return;

      try {
        const snap = await getDoc(doc(db, 'recipes', id));

        if (!snap.exists()) {
          setError(t.recipeNotFound);
          setLoading(false);
          return;
        }

        const data = snap.data();

        setForm({
          title: data.title || '',
          ingredients: data.ingredients || '',
          instructions: data.instructions || '',
          notes: data.notes || '',
          prepTime: data.prepTime || '',
          category: data.category || 'Dinner',
        });
      } catch {
        setError(t.loadRecipeFailed);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !user) return;

    setSaving(true);
    setError('');

    try {
      await updateDoc(doc(db, 'recipes', id), {
        ...form,
        editedById: user.uid,
        editedByName: user.displayName || user.email,
        updatedAt: Date.now(),
      });

      navigate(`/recipe/${id}`);
    } catch {
      setError(t.updateRecipeFailed);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-[#a54d2a] font-serif text-xl animate-pulse">
        {t.loading}
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold text-[#a54d2a] mb-8">
        {t.editRecipeTitle}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#fff8e4] border-2 border-[#a54d2a] rounded-xl p-6 flex flex-col gap-5"
      >
        <div>
          <label className="block text-sm font-semibold text-[#a54d2a] mb-1">
            {t.recipeTitle} *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#a54d2a] mb-1">
              {t.prepTimeLabel} *
            </label>
            <input
              name="prepTime"
              value={form.prepTime}
              onChange={handleChange}
              type="number"
              className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#a54d2a] mb-1">
              {t.category} *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a] bg-white"
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {
                    {
                      Breakfast: t.breakfast,
                      Lunch: t.lunch,
                      Dinner: t.dinner,
                      Dessert: t.dessert,
                      Snack: t.snack,
                      Drink: t.drink,
                      Other: t.other,
                    }[c]
                  }
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#a54d2a] mb-1">
            {t.ingredients} *
          </label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a] resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#a54d2a] mb-1">
            {t.instructions} *
          </label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a] resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#a54d2a] mb-1">
            {t.notesTips}
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a] resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#a54d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#c76139] transition-colors disabled:opacity-50"
          >
            {saving ? t.savingChanges : t.saveChanges}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border-2 border-[#a54d2a] text-[#a54d2a] rounded-lg font-semibold hover:bg-[#ffeaad] transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </form>
    </main>
  );
}