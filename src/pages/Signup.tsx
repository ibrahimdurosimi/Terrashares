import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SuccessModal } from '../components/SuccessModal';
import { Building2, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState<string | undefined>('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Bot check
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [botAnswer, setBotAnswer] = useState('');

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, text: '', color: 'bg-gray-200 dark:bg-gray-700' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (score <= 2) return { score, text: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, text: 'Good', color: 'bg-yellow-500' };
    return { score, text: 'Strong', color: 'bg-green-500' };
  };

  const passStrength = getPasswordStrength(password);
  const emailsMatch = email && confirmEmail && email === confirmEmail;
  const emailsMismatch = email && confirmEmail && email !== confirmEmail;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (parseInt(botAnswer) !== num1 + num2) {
      setError('Incorrect security question answer. Are you a bot?');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (email !== confirmEmail) {
      setError("Emails don't match");
      return;
    }

    if (!phone) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`.trim(),
          first_name: firstName,
          last_name: lastName,
          phone,
          location,
          role: 'investor'
        }
      }
    });

    if (error) {
      if (error.message === "Failed to fetch" || error.message?.includes("Failed to fetch")) {
        setError("Network error: Please check your Supabase URL and configuration.");
      } else {
        setError(error.message && error.message !== "{}" ? error.message : "Database error: Please run the latest SQL migration in your Supabase SQL editor to fix the user creation policies.");
      }
      setLoading(false);
    } else {
      setLoading(false);
      setSuccess(true);
    }
  };

  

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#171717]">
      <SuccessModal
        isOpen={success}
        onClose={() => navigate('/login')}
        title="Check your email"
        message={`We've sent a validation link to ${email}. Please click the link to verify your account and start investing.`}
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
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Real Estate"
            className="w-full h-full object-cover opacity-20 mix-blend-multiply dark:mix-blend-overlay grayscale-[30%]"
          />
        </div>
        
        <div className="relative z-10 max-w-lg text-[#171717] dark:text-white">
          <div className="mb-8">
            <Building2 className="w-12 h-12 text-[#9ABA1B]" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Welcome to the future of real estate.
          </h1>
          <p className="text-xl mb-12 opacity-80 leading-relaxed">
            A personal note from the Terrashare Team: We built this platform because we believe premium property investment shouldn't be restricted to the ultra-wealthy. We are thrilled you're taking the first step to rewrite your financial future with us.
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
            <div>
              <div className="text-4xl font-black mb-2 text-[#9ABA1B]">16.4%</div>
              <div className="font-medium opacity-80 uppercase tracking-wider text-sm">Average Hist. ROI</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2 text-[#9ABA1B]">100%</div>
              <div className="font-medium opacity-80 uppercase tracking-wider text-sm">Asset Backed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 py-12 bg-white dark:bg-[#171717] overflow-y-auto pt-24">
        <div className="w-full max-w-md mx-auto lg:max-w-xl">
          <div className="lg:hidden mb-8 flex justify-center">
            <Building2 className="w-12 h-12 text-[#9ABA1B]" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-[#171717] dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Create your account
          </h2>
          <p className="text-[#171717]/60 dark:text-white/60 mb-10">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#9ABA1B] hover:underline">
              Log in instead
            </Link>
          </p>

          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                  placeholder="John"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
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
              
              <div className="relative">
                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">Confirm Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    className={`w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border ${emailsMismatch ? 'border-red-500 focus:ring-red-500' : 'border-black/5 dark:border-white/10 focus:ring-[#9ABA1B]'} focus:ring-2 focus:border-transparent transition-colors text-[#171717] dark:text-white pr-10`}
                    placeholder="john@example.com"
                  />
                  {emailsMatch && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {emailsMismatch && (
                  <p className="text-red-500 text-xs mt-1 absolute -bottom-5">Emails do not match</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
              <div>
                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                  placeholder="••••••••"
                />
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-grow flex gap-1 h-1.5">
                      <div className={`flex-1 rounded-full ${passStrength.score >= 1 ? passStrength.color : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                      <div className={`flex-1 rounded-full ${passStrength.score >= 3 ? passStrength.color : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                      <div className={`flex-1 rounded-full ${passStrength.score >= 5 ? passStrength.color : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    </div>
                    <span className={`text-xs font-bold ${passStrength.score >= 5 ? 'text-green-500' : passStrength.score >= 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {passStrength.text}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="custom-phone-input">
                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus-within:ring-2 focus-within:ring-[#9ABA1B] focus-within:border-transparent transition-colors flex items-center">
                  <PhoneInput
                    international
                    defaultCountry="NG"
                    value={phone}
                    onChange={setPhone}
                    className="w-full outline-none bg-transparent text-[#171717] dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">City, Country</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                  placeholder="Lagos, Nigeria"
                />
              </div>
            </div>

            {/* Security Check */}
            <div className="pt-2">
              <label className="block text-sm font-bold text-[#171717] dark:text-white/80 uppercase tracking-wider mb-2">Security Check: {num1} + {num2} = ?</label>
              <input
                type="number"
                required
                value={botAnswer}
                onChange={(e) => setBotAnswer(e.target.value)}
                className="w-full h-14 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:ring-2 focus:ring-[#9ABA1B] focus:border-transparent transition-colors text-[#171717] dark:text-white"
                placeholder="Enter the sum to prove you're human"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !emailsMatch || passStrength.score <= 2}
                className="w-full h-14 flex justify-center items-center rounded-full bg-[#171717] dark:bg-white text-white dark:text-[#171717] font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-xl shadow-black/10"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
            
            <div className="flex items-start gap-3 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <ShieldCheck className="w-5 h-5 text-[#9ABA1B] shrink-0 mt-0.5" />
              <p>
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="font-bold text-[#171717] dark:text-white hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-bold text-[#171717] dark:text-white hover:underline">Privacy Policy</Link>. 
                We use secure encryption to protect your data.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
