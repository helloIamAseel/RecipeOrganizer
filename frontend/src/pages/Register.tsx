import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: username });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  }

  async function handleGoogle() {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate('/');
    } catch {
      setError('Google sign-in failed.');
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-[#fff8e4] border-2 border-[#a54d2a] rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-serif font-bold text-[#a54d2a] mb-6 text-center">Create Account</h1>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a]"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a]"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="px-4 py-3 border-2 border-[#a54d2a]/30 rounded-lg focus:outline-none focus:border-[#a54d2a]"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-[#a54d2a] text-white py-3 rounded-lg font-semibold hover:bg-[#c76139] transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#a54d2a] font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </main>
  );
}
