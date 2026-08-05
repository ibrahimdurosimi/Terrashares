import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Failed to fetch" || error.message?.includes("Failed to fetch")) {
        setError("Network error: Please check your Supabase URL and configuration.");
      } else {
        setError(error.message && error.message !== "{}" ? error.message : "Database error: Please run the latest SQL migration in your Supabase SQL editor to fix the user creation policies.");
      }
      setLoading(false);
    } else {
      // Check role
      const { data: userData } = await supabase.from('users').select('role').eq('id', data.user.id).single();
      if (userData ? (userData as any).role === 'admin' : false) {
        navigate('/admin/properties');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#171717]">
      {/* Left Side - Marketing & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#9ABA1B] dark:bg-[#141c0d] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Real Estate"
            className="w-full h-full object-cover opacity-20 mix-blend-multiply dark:mix-blend-overlay grayscale-[30%]"
          />
        </div>
        
        <div className="relative z-10 max-w-lg text-[#171717] dark:text-white">
          <div className="mb-8">
            <Building2 className="w-12 h-12 text-[#9ABA1B]" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Welcome back to Terrashare.
          </h1>
          <p className="text-xl mb-12 opacity-80 leading-relaxed">
            Log in to access your portfolio, track property performance, and explore new investment opportunities. We're glad to have you back.
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-4xl font-black mb-2 text-[#9ABA1B]">15k+</div>
              <div className="font-medium opacity-80 uppercase tracking-wider text-sm">Active Investors</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2 text-[#9ABA1B]">₦20B+</div>
              <div className="font-medium opacity-80 uppercase tracking-wider text-sm">Property Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 bg-white dark:bg-[#171717]">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-8 flex justify-center">
            <Building2 className="w-12 h-12 text-[#9ABA1B]" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-[#171717] dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Log in to your account
          </h2>
          <p className="text-[#171717]/60 dark:text-white/60 mb-10">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-[#9ABA1B] hover:underline">
              Create an account
            </Link>
          </p>

          <form className="grid grid-cols-2 gap-4 sm:gap-6" onSubmit={handleLogin}>
            {error && (
              <div className="col-span-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider truncate mr-2">Password</label>
                <Link to="/forgot-password" className="text-xs sm:text-sm font-bold text-[#9ABA1B] hover:underline shrink-0 truncate">Forgot?</Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div className="col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 flex justify-center items-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-xl shadow-black/10"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
