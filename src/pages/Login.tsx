import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, Mail, Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center max-w-7xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[40px] shadow-sm max-w-md w-full space-y-10 text-center"
      >
        <div className="space-y-4">
          <div className="w-20 h-20 bg-[#f5f5f0] rounded-full flex items-center justify-center mx-auto text-[#5A5A40]">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl font-light italic">Welcome Back</h1>
          <p className="text-[#1a1a1a]/40 text-sm uppercase tracking-widest">Sign in to access your account</p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-4 bg-[#f5f5f0] hover:bg-[#5A5A40]/10 py-4 rounded-full transition-all group"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1a1a1a]/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/20">
              <span className="bg-white px-4">Or use email</span>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={18} />
                <input 
                  disabled
                  type="email"
                  className="w-full pl-16 pr-6 py-4 bg-[#f5f5f0] rounded-full text-sm opacity-50 cursor-not-allowed"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={18} />
                <input 
                  disabled
                  type="password"
                  className="w-full pl-16 pr-6 py-4 bg-[#f5f5f0] rounded-full text-sm opacity-50 cursor-not-allowed"
                  placeholder="********"
                />
              </div>
            </div>
          </div>

          <button 
            disabled
            className="w-full bg-[#1a1a1a]/10 text-[#1a1a1a]/20 py-4 rounded-full text-sm uppercase tracking-widest font-bold cursor-not-allowed"
          >
            Sign In
          </button>
        </div>

        <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};
