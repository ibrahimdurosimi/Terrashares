import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, AlertCircle } from 'lucide-react';
import { SuccessModal } from '../components/SuccessModal';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // We are ready to reset
      }
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#171717]">
      <SuccessModal
        isOpen={success}
        onClose={() => navigate('/login')}
        title="Password Reset"
        message="Your password has been successfully updated. You can now log in with your new password."
        actionButton={
          <Link
            to="/login"
            className="w-full h-14 flex items-center justify-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold hover:bg-gray-800 transition-colors shadow-xl"
          >
            Go to Login
          </Link>
        }
      />
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
            Set new password.
          </h1>
          <p className="text-xl mb-12 opacity-80 leading-relaxed">
            Please enter your new password below.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 bg-white dark:bg-[#171717]">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-8 flex justify-center">
            <Building2 className="w-12 h-12 text-[#9ABA1B]" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-[#171717] dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            New Password
          </h2>
          <p className="text-[#171717]/60 dark:text-white/60 mb-10">
            Enter your new password
          </p>

          <form className="space-y-6" onSubmit={handleUpdate}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                placeholder="••••••••"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 flex justify-center items-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-xl shadow-black/10"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
