import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Share2, Star, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A5A40]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f0] space-y-6">
        <h2 className="text-3xl font-light italic">Product not found</h2>
        <button 
          onClick={() => navigate('/shop')}
          className="bg-[#5A5A40] text-white px-8 py-3 rounded-full text-sm uppercase tracking-widest"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-sm uppercase tracking-widest text-[#1a1a1a]/50 hover:text-[#5A5A40] transition-colors mb-12"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-[4/5] bg-white rounded-[40px] overflow-hidden shadow-sm"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="bg-[#5A5A40]/10 text-[#5A5A40] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex text-[#5A5A40]">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>
            </div>
            <h1 className="text-5xl font-light italic leading-tight">{product.name}</h1>
            <p className="text-3xl font-bold">₹{product.price}</p>
          </div>

          <div className="space-y-6">
            <p className="text-[#1a1a1a]/70 leading-relaxed text-lg">
              {product.description}
            </p>
            
            {product.benefits && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-bold">Key Benefits</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm text-[#1a1a1a]/60">
                      <CheckCircle2 size={16} className="text-[#5A5A40]" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-10 border-t border-[#1a1a1a]/10 space-y-8">
            <div className="flex items-center space-x-6">
              <div className="flex items-center border border-[#1a1a1a]/10 rounded-full px-4 py-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:text-[#5A5A40]"
                >
                  -
                </button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:text-[#5A5A40]"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#5A5A40] text-white py-4 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all flex items-center justify-center space-x-3"
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>
              <button className="p-4 border border-[#1a1a1a]/10 rounded-full hover:bg-white transition-colors">
                <Heart size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold">
              <div className="flex items-center space-x-2">
                <Share2 size={14} />
                <span>Share this product</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>Free Shipping</span>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>

          {product.usage && (
            <div className="bg-white p-8 rounded-[32px] space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-bold">How to Use</h4>
              <p className="text-sm text-[#1a1a1a]/60 leading-relaxed italic">
                {product.usage}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
