import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from './hooks/useAuthState';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyRecipes from './pages/MyRecipes';
import AddRecipe from './pages/AddRecipe';
import Favorites from './pages/Favorites';
import WeeklyHighlights from './pages/WeeklyHighlights';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthState();
  if (loading) return <div className="min-h-screen bg-[#ffeaad] flex items-center justify-center">
    <div className="text-[#a54d2a] text-2xl font-serif animate-pulse">Loading...</div>
  </div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#ffeaad]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/my-recipes" element={<ProtectedRoute><MyRecipes /></ProtectedRoute>} />
          <Route path="/add-recipe" element={<ProtectedRoute><AddRecipe /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/weekly" element={<WeeklyHighlights />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
