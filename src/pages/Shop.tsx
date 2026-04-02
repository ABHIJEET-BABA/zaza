import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { motion } from 'motion/react';
import { Filter, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  const categories = ['All', 'Cold Pressed', 'Essential', 'Hair Care', 'Skin Care'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = collection(db, 'products');
        const querySnapshot = await getDocs(q);
        const allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        let filtered = allProducts;
        if (category !== 'All') {
          filtered = filtered.filter(p => p.category === category);
        }
        if (search) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        setProducts(filtered);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-light italic">Our Collection</h1>
        <p className="text-[#1a1a1a]/50 text-sm uppercase tracking-widest">Handcrafted with Tradition. Packed with Care.</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 bg-white p-6 rounded-[40px] shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                category === cat 
                  ? 'bg-[#5A5A40] text-white' 
                  : 'bg-[#f5f5f0] text-[#1a1a1a]/60 hover:bg-[#5A5A40]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-[3/4] bg-gray-200 rounded-3xl"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <div className="w-20 h-20 bg-[#f5f5f0] rounded-full flex items-center justify-center mx-auto text-[#1a1a1a]/20">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-xl font-medium italic">No products found</h3>
          <p className="text-sm text-[#1a1a1a]/50">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-[3/4] bg-white rounded-3xl overflow-hidden mb-6 relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="absolute bottom-6 left-6 right-6 bg-white text-[#1a1a1a] py-3 rounded-full text-xs uppercase tracking-widest font-bold shadow-xl translate-y-12 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#5A5A40] hover:text-white"
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <span className="text-sm font-bold">₹{product.price}</span>
                  </div>
                  <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest">{product.category}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
