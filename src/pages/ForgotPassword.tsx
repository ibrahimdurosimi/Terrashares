import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0a0a0a] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Check your email
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            We've sent password reset instructions to <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
          </p>
          <Link
            to="/login"
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#0A0A0A] dark:bg-white px-10 text-sm font-bold text-white dark:text-[#0A0A0A] hover:bg-gray-800 transition-colors shadow-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0a0a0a]">
      {/* Left Side - Marketing & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F7D0BC] dark:bg-[#1f120a] relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Real Estate"
            className="w-full h-full object-cover opacity-20 mix-blend-multiply dark:mix-blend-overlay grayscale-[30%]"
          />
        </div>
        
        <div className="relative z-10 max-w-lg text-[#0A0A0A] dark:text-white">
          <div className="mb-8">
            <Building2 className="w-12 h-12 text-[#9B8924]" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Reset your password.
          </h1>
          <p className="text-xl mb-12 opacity-80 leading-relaxed">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 bg-white dark:bg-[#0a0a0a]">
        <div className="w-full max-w-md mx-auto">
          <Link to="/login" className="inline-flex items-center text-sm font-bold text-[#9B8924] hover:underline mb-8">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
          </Link>
          
          <div className="lg:hidden mb-8 flex justify-center">
            <Building2 className="w-12 h-12 text-[#9B8924]" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-[#0A0A0A] dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Forgot password?
          </h2>
          <p className="text-[#0A0A0A]/60 dark:text-white/60 mb-10">
            No worries, we'll send you reset instructions.
          </p>

          <form className="space-y-6" onSubmit={handleReset}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-[#0A0A0A] dark:text-white/80 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9B8924] focus:border-transparent transition-colors text-[#0A0A0A] dark:text-white"
                placeholder="john@example.com"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 flex justify-center items-center rounded-full bg-[#0A0A0A] dark:bg-white text-white dark:text-[#0A0A0A] font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-xl shadow-black/10"
              >
                {loading ? 'Sending...' : 'Reset Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
