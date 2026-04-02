import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Leaf, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, query, limit, getDocs, addDoc, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Banner } from '../types';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Banners
        const bannerQuery = query(
          collection(db, 'banners'), 
          where('active', '==', true),
          orderBy('order', 'asc')
        );
        const bannerSnapshot = await getDocs(bannerQuery);
        const fetchedBanners = bannerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Banner));
        
        if (fetchedBanners.length === 0) {
          // Seed initial banner if none exist
          const initialBanner = {
            title: "Fuel Your Health, Naturally.",
            subtitle: "Pure & Traditional Wood Pressed Oils",
            image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1974&auto=format&fit=crop",
            link: "/shop",
            active: true,
            order: 0,
            createdAt: new Date().toISOString()
          };
          const docRef = await addDoc(collection(db, 'banners'), initialBanner);
          setBanners([{ id: docRef.id, ...initialBanner }]);
        } else {
          setBanners(fetchedBanners);
        }

        // Fetch Featured Products
        const q = query(collection(db, 'products'), limit(4));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Seed initial products
          const initialProducts = [
            {
              name: "Wood Pressed Mustard Oil",
              description: "Authentic wood-pressed mustard oil, rich in natural nutrients and pungent aroma. Perfect for traditional Indian cooking.",
              price: 290,
              category: "Cold Pressed",
              image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1000&auto=format&fit=crop",
              stock: 100,
              benefits: ["Rich in Omega-3", "Good for heart", "High smoke point"],
              usage: "Ideal for sautéing, deep frying, and traditional Indian pickles.",
              createdAt: new Date().toISOString()
            },
            {
              name: "Virgin Coconut Oil",
              description: "Pure virgin coconut oil extracted from fresh coconuts. Great for both cooking and skin care.",
              price: 900,
              category: "Cold Pressed",
              image: "https://images.unsplash.com/photo-1590730310295-ce3002a91571?q=80&w=1000&auto=format&fit=crop",
              stock: 50,
              benefits: ["Boosts metabolism", "Great for skin/hair", "Medium-chain triglycerides"],
              usage: "Use for baking, raw consumption, or as a natural moisturizer.",
              createdAt: new Date().toISOString()
            },
            {
              name: "Wood Pressed Groundnut Oil",
              description: "Traditional wood-pressed groundnut oil with a nutty flavor and high nutritional value.",
              price: 540,
              category: "Cold Pressed",
              image: "https://images.unsplash.com/photo-1541944743827-e04bb645f996?q=80&w=1000&auto=format&fit=crop",
              stock: 80,
              benefits: ["Rich in Vitamin E", "Heart healthy", "Zero cholesterol"],
              usage: "Perfect for deep frying and everyday cooking.",
              createdAt: new Date().toISOString()
            },
            {
              name: "Premium Sesame Oil",
              description: "Finest quality sesame oil, wood-pressed to retain its distinct nutty aroma and health benefits.",
              price: 750,
              category: "Cold Pressed",
              image: "https://images.unsplash.com/photo-1620706122100-316bc32fa05e?q=80&w=1000&auto=format&fit=crop",
              stock: 60,
              benefits: ["High in antioxidants", "Good for oral health", "Anti-inflammatory"],
              usage: "Great for Asian cuisine, oil pulling, and body massage.",
              createdAt: new Date().toISOString()
            }
          ];

          for (const p of initialProducts) {
            await addDoc(collection(db, 'products'), p);
          }
          const reSnapshot = await getDocs(q);
          setFeaturedProducts(reSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        } else {
          setFeaturedProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(nextBanner, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section / Banner Slider */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-[#E6E6E6]">
        <AnimatePresence mode="wait">
          {banners.length > 0 && (
            <motion.div 
              key={banners[currentBanner].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={banners[currentBanner].image} 
                  alt={banners[currentBanner].title} 
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#f5f5f0]/80 to-transparent"></div>
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-2xl space-y-8"
                >
                  <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#5A5A40]">
                    {banners[currentBanner].subtitle || "Pure & Traditional"}
                  </span>
                  <h1 className="text-6xl md:text-8xl font-light leading-[0.9] tracking-tighter">
                    {banners[currentBanner].title.split(',').map((part, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {part.includes('Naturally') ? <span className="italic font-serif">{part}</span> : part}
                      </React.Fragment>
                    ))}
                  </h1>
                  <p className="text-lg text-[#1a1a1a]/70 max-w-lg leading-relaxed">
                    Nutrient-rich and wood-pressed to retain every drop of goodness. 
                    Experience the essence of purity in every bottle.
                  </p>
                  <div className="flex space-x-4">
                    <Link 
                      to={banners[currentBanner].link || "/shop"} 
                      className="bg-[#5A5A40] text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-[#4a4a35] transition-all flex items-center group"
                    >
                      Shop Now
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      to="/about" 
                      className="border border-[#1a1a1a]/20 px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-white transition-all"
                    >
                      Our Story
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {banners.length > 1 && (
          <>
            <button 
              onClick={prevBanner}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-all group"
            >
              <ChevronLeft size={24} className="group-hover:text-[#5A5A40]" />
            </button>
            <button 
              onClick={nextBanner}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white transition-all group"
            >
              <ChevronRight size={24} className="group-hover:text-[#5A5A40]" />
            </button>
            
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
              {banners.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`h-1.5 rounded-full transition-all ${i === currentBanner ? 'w-12 bg-[#5A5A40]' : 'w-3 bg-[#5A5A40]/20'}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A5A40]">Curated Selection</span>
            <h2 className="text-5xl md:text-7xl font-light italic leading-tight">Our Signature <br />Collections</h2>
          </div>
          <Link to="/shop" className="group flex items-center space-x-3 text-sm uppercase tracking-widest font-bold border-b border-[#1a1a1a]/10 pb-2 hover:border-[#5A5A40] transition-all">
            <span>Explore All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse space-y-6">
                <div className="aspect-[3/4] bg-gray-200 rounded-[40px]"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-[3/4] bg-white rounded-[40px] overflow-hidden mb-8 relative shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 right-6">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 px-2">
                    <h3 className="text-xl font-medium group-hover:text-[#5A5A40] transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#1a1a1a]/40 italic">Premium Cold Pressed</p>
                      <p className="text-lg font-light">₹{product.price}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Our Process Section */}
      <section className="bg-[#f5f5f0] py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1000&auto=format&fit=crop" 
                  alt="Traditional Wood Pressing" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#5A5A40] rounded-full flex items-center justify-center text-white p-8 text-center z-20 shadow-xl">
                <p className="text-xs uppercase tracking-widest font-bold leading-tight">100% Wood Pressed</p>
              </div>
              <div className="absolute -bottom-12 -right-12 w-64 h-64 border-2 border-[#5A5A40]/20 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A5A40]">The Traditional Way</span>
                <h2 className="text-5xl md:text-6xl font-light italic leading-tight">Preserving Nature's <br />Purest Essence</h2>
                <p className="text-lg text-[#1a1a1a]/60 leading-relaxed">
                  Unlike modern industrial extraction, our wood-pressing technique (Kachi Ghani) 
                  maintains a low temperature, ensuring that every drop of oil retains its 
                  natural nutrients, antioxidants, and authentic aroma.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4 p-8 bg-white rounded-[40px] shadow-sm">
                  <div className="w-12 h-12 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#5A5A40]">
                    <Leaf size={20} />
                  </div>
                  <h4 className="font-bold uppercase tracking-widest text-xs">Zero Heat</h4>
                  <p className="text-xs text-[#1a1a1a]/40 leading-relaxed">Cold-pressed below 40°C to keep enzymes alive.</p>
                </div>
                <div className="space-y-4 p-8 bg-white rounded-[40px] shadow-sm">
                  <div className="w-12 h-12 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#5A5A40]">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-bold uppercase tracking-widest text-xs">No Chemicals</h4>
                  <p className="text-xs text-[#1a1a1a]/40 leading-relaxed">Pure extraction without solvents or additives.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories / Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[800px]">
          <div className="md:col-span-8 relative group rounded-[60px] overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1541944743827-e04bb645f996?q=80&w=1000&auto=format&fit=crop" 
              alt="Culinary Oils" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12 text-white space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">Collection</span>
              <h3 className="text-5xl font-light italic">Culinary Mastery</h3>
              <Link to="/shop?category=Cold Pressed" className="inline-block bg-white text-[#1a1a1a] px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#f5f5f0] transition-colors">
                Shop Culinary
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 grid grid-rows-2 gap-8">
            <div className="relative group rounded-[60px] overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1590730310295-ce3002a91571?q=80&w=1000&auto=format&fit=crop" 
                alt="Wellness" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white space-y-2">
                <h3 className="text-2xl font-light italic">Self Care</h3>
                <Link to="/shop" className="text-[10px] uppercase tracking-widest font-bold border-b border-white/40 pb-1 hover:border-white transition-colors">Explore</Link>
              </div>
            </div>
            <div className="relative group rounded-[60px] overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1620706122100-316bc32fa05e?q=80&w=1000&auto=format&fit=crop" 
                alt="Traditional" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white space-y-2">
                <h3 className="text-2xl font-light italic">Ancient Rituals</h3>
                <Link to="/shop" className="text-[10px] uppercase tracking-widest font-bold border-b border-white/40 pb-1 hover:border-white transition-colors">Explore</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-[#5A5A40] text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 text-center">
            <div className="space-y-8 flex flex-col items-center group">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#5A5A40] transition-all duration-500">
                <Leaf size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-medium italic">100% Pure & Natural</h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
                  Wood-pressed at low temperatures to ensure all natural nutrients and antioxidants are preserved.
                </p>
              </div>
            </div>
            <div className="space-y-8 flex flex-col items-center group">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#5A5A40] transition-all duration-500">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-medium italic">Uncompromised Quality</h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
                  No chemicals, no preservatives, and no artificial fragrances. Just the pure essence of nature.
                </p>
              </div>
            </div>
            <div className="space-y-8 flex flex-col items-center group">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#5A5A40] transition-all duration-500">
                <Heart size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-medium italic">Health First</h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-xs mx-auto">
                  Rich in healthy fats and essential minerals that support heart health and radiant skin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-[#1a1a1a] text-white p-16 md:p-24 rounded-[60px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5A5A40] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-5xl font-light italic leading-tight">Join the Zaza <br />Inner Circle</h2>
              <p className="text-white/60 text-lg">Receive exclusive recipes, health tips, and early access to new collections.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-8 py-5 bg-white/10 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
              />
              <button className="bg-white text-[#1a1a1a] px-12 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#f5f5f0] transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-6 mb-24">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A5A40]">Happy Clients</span>
          <h2 className="text-5xl md:text-6xl font-light italic">Kind Words from <br />Our Community</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: "Anjali Sharma", text: "Absolutely loved the packaging and professionalism. The quality of the mustard oil is unmatched!", rating: 5, role: "Home Chef" },
            { name: "Vikram Singh", text: "Fast delivery and premium quality products. The coconut oil is now a staple in our kitchen.", rating: 5, role: "Fitness Enthusiast" },
            { name: "Priya Patel", text: "The product exceeded expectations. Highly recommended for anyone looking for authentic wood-pressed oils.", rating: 5, role: "Yoga Instructor" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }}
              className="bg-white p-12 rounded-[60px] space-y-8 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="flex text-[#5A5A40] space-x-1">
                {[...Array(item.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xl italic leading-relaxed text-[#1a1a1a]/80">"{item.text}"</p>
              <div className="pt-8 border-t border-[#1a1a1a]/5 flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#5A5A40] font-bold italic">
                  {item.name[0]}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold">{item.name}</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
