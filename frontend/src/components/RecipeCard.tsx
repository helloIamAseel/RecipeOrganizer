import { Link } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from '../hooks/useAuthState';

export interface Recipe {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  notes: string;
  prepTime: string;
  category: string;
  authorId: string;
  authorName: string;
  likes: string[];
  createdAt: number;
  imageUrl?: string;
}

interface Props {
  recipe: Recipe;
  onLikeToggle?: () => void;
  onDelete?: () => void;
}

export default function RecipeCard({ recipe, onLikeToggle, onDelete }: Props) {
  const { user } = useAuthState();
  const isLiked = user ? recipe.likes?.includes(user.uid) : false;

  async function toggleLike() {
    if (!user) return;
    const ref = doc(db, 'recipes', recipe.id);
    if (isLiked) {
      await updateDoc(ref, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(ref, { likes: arrayUnion(user.uid) });
    }
    onLikeToggle?.();
  }

  return (
    <div className="bg-[#fff8e4]  border-2 border-[#a54d2a] rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/recipe/${recipe.id}`}>
            <h2 className="text-xl font-serif font-bold text-[#a54d2a] hover:underline">
              {recipe.title}
            </h2>
          </Link>
          <span className="text-xs bg-[#ffeaad] text-[#a54d2a] px-2 py-1 rounded-full font-medium">
            {recipe.category}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-1">⏱ {recipe.prepTime} min · by {recipe.authorName}</p>

        <p className="text-gray-700 text-sm line-clamp-2 mb-3">
          {recipe.ingredients}
        </p>

        <div className="flex items-center justify-between">
          <Link
            to={`/recipe/${recipe.id}`}
            className="text-sm text-[#a54d2a] font-semibold hover:underline"
          >
            View Recipe →
          </Link>
            <div className="flex items-center gap-2">
              {onDelete && (
               <button
                onClick={onDelete}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-500 hover:bg-red-200"
              >
                 Delete
                </button>
             )}
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isLiked
                ? 'bg-red-100 text-red-500'
                : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400'
            }`}
          >
            {isLiked ? '❤️' : '🤍'} {recipe.likes?.length || 0}
          </button>
        </div>
       </div>
      </div>
    </div>
  );
}
