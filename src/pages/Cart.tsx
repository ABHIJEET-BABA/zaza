import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 max-w-7xl mx-auto px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#1a1a1a]/10">
          <ShoppingBag size={48} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-light italic">Your cart is empty</h2>
          <p className="text-sm text-[#1a1a1a]/40 uppercase tracking-widest">Looks like you haven't added anything yet.</p>
        </div>
        <Link 
          to="/shop" 
          className="bg-[#5A5A40] text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-light italic">Your Shopping Cart</h1>
        <p className="text-[#1a1a1a]/50 text-sm uppercase tracking-widest">{itemCount} Items in your bag</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-8 bg-white p-6 rounded-[40px] shadow-sm group"
              >
                <div className="w-24 h-32 bg-[#f5f5f0] rounded-3xl overflow-hidden shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium">{item.name}</h3>
                      <p className="text-sm text-[#1a1a1a]/40 uppercase tracking-widest">₹{item.price} per unit</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-[#1a1a1a]/20 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-[#1a1a1a]/5">
                    <div className="flex items-center space-x-4 bg-[#f5f5f0] rounded-full px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:text-[#5A5A40]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:text-[#5A5A40]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[40px] shadow-sm space-y-8 sticky top-32">
            <h3 className="text-xl font-medium italic">Order Summary</h3>
            
            <div className="space-y-4 text-sm uppercase tracking-widest">
              <div className="flex justify-between text-[#1a1a1a]/60">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-[#1a1a1a]/60">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="pt-4 border-t border-[#1a1a1a]/10 flex justify-between text-lg font-bold text-[#1a1a1a]">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#5A5A40] text-white py-5 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all flex items-center justify-center group"
            >
              Proceed to Checkout
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-6 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a1a1a]/40 font-bold">
                Secure checkout powered by Zaza Oils
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
