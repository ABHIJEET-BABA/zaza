import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-[#1a1a1a]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tighter uppercase">Zaza Oils</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm uppercase tracking-widest hover:text-[#5A5A40] transition-colors">Home</Link>
            <Link to="/shop" className="text-sm uppercase tracking-widest hover:text-[#5A5A40] transition-colors">Shop</Link>
            <Link to="/recipes" className="text-sm uppercase tracking-widest hover:text-[#5A5A40] transition-colors">Recipes</Link>
            <Link to="/contact" className="text-sm uppercase tracking-widest hover:text-[#5A5A40] transition-colors">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm uppercase tracking-widest text-[#5A5A40] font-bold hover:text-[#4a4a35] transition-colors">Admin</Link>
            )}
            <Link to="/about" className="text-sm uppercase tracking-widest hover:text-[#5A5A40] transition-colors">About</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            {isAdmin && (
              <Link to="/admin" className="p-2 hover:bg-[#f5f5f0] rounded-full transition-colors">
                <LayoutDashboard size={20} />
              </Link>
            )}
            
            <Link to="/cart" className="relative p-2 hover:bg-[#f5f5f0] rounded-full transition-colors">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#5A5A40] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-[#f5f5f0] rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-[#f5f5f0] rounded-full transition-colors">
                <User size={20} />
              </Link>
            )}

            <button 
              className="md:hidden p-2 hover:bg-[#f5f5f0] rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#1a1a1a]/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-sm uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="block text-sm uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Shop</Link>
              <Link to="/recipes" className="block text-sm uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Recipes</Link>
              <Link to="/contact" className="block text-sm uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              {isAdmin && (
                <Link to="/admin" className="block text-sm uppercase tracking-widest text-[#5A5A40] font-bold" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
              )}
              <Link to="/about" className="block text-sm uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>About</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
