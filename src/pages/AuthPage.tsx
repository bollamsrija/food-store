import { useState } from 'react';
import { Eye, EyeOff, Leaf, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

interface AuthPageProps {
  mode: 'login' | 'register';
  onNavigate: (page: string) => void;
}

export default function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const { showToast } = useApp();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Welcome back!');
        onNavigate('home');
      }
    } else {
      if (!name.trim()) { showToast('Please enter your name', 'error'); setLoading(false); return; }
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        showToast(error.message, 'error');
      } else if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: name,
          phone,
          role: 'customer',
        });
        showToast('Account created successfully!');
        onNavigate('home');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 bg-gradient-to-br from-forest-50 to-warm-50">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 bg-forest-600 rounded-2xl flex items-center justify-center shadow-green">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div className="font-display font-bold text-forest-800 text-xl">Sri Sai Natural Foods</div>
          </button>
        </div>

        <div className="card p-8">
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-white text-forest-700 shadow-sm' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white text-forest-700 shadow-sm' : 'text-gray-500'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><Loader className="w-4 h-4 animate-spin" /> {isLogin ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-forest-700 font-semibold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
