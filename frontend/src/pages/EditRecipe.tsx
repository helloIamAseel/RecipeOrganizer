import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';
import { useNavigate, useParams } from 'react-router-dom';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink', 'Other'];

export default function EditRecipe() {
    const { user } = useAuthState();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

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

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }

    useEffect(() => {
        async function fetchRecipe() {
            if (!id) return;

            try {
                const snap = await getDoc(doc(db, 'recipes', id));

                if (!snap.exists()) {
                    setError('Recipe not found.');
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
                setError('Failed to load recipe.');
            } finally {
                setLoading(false);
            }
        }

        fetchRecipe();
    }, [id]);

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
            setError('Failed to update recipe. Please try again.');
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="text-center py-20 text-[#a54d2a] font-serif text-xl animate-pulse">Loading...</div>;
    }

    return (
        <main className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-serif font-bold text-[#a54d2a] mb-8">Edit Recipe</h1>

            <form onSubmit={handleSubmit} className="bg-[#fff8e4] border-2 border-[#a54d2a] rounded-xl p-6 flex flex-col gap-5">
                <div>
                    <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Recipe Title *</label>
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
                        <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Prep Time (minutes) *</label>
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
                        <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Category *</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a] bg-white"
                        >
                            {categories.map(c => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Ingredients *</label>
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
                    <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Instructions *</label>
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
                    <label className="block text-sm font-semibold text-[#a54d2a] mb-1">Notes & Tips</label>
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
                        {saving ? 'Saving Changes...' : 'Save Changes'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 border-2 border-[#a54d2a] text-[#a54d2a] rounded-lg font-semibold hover:bg-[#ffeaad] transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
}