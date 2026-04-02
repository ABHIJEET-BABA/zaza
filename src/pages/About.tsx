import React from 'react';
import { motion } from 'motion/react';
import { Shield, Leaf, Heart, Award, Users, History } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-[#5A5A40]">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1974&auto=format&fit=crop" 
            alt="Our Heritage" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/60"
          >
            Our Heritage
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-light italic text-white leading-tight"
          >
            Rooted in <br />Tradition
          </motion.h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A5A40]">Since 1984</span>
              <h2 className="text-5xl md:text-6xl font-light italic leading-tight">A Legacy of Purity</h2>
              <p className="text-lg text-[#1a1a1a]/60 leading-relaxed">
                Zaza Oils began with a simple vision: to bring back the authentic taste and health 
                benefits of traditional wood-pressed oils. What started in a small village in 
                Haryana has now grown into a premium brand trusted by thousands of families.
              </p>
              <p className="text-lg text-[#1a1a1a]/60 leading-relaxed">
                We believe that nature provides everything we need to thrive. Our mission is 
                to preserve that natural goodness through traditional methods, ensuring that 
                no chemical or heat ever touches our oils.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-[#1a1a1a]/5">
              <div className="space-y-2">
                <p className="text-4xl font-light italic text-[#5A5A40]">35+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Years of Expertise</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-light italic text-[#5A5A40]">10k+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Happy Families</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1000&auto=format&fit=crop" 
                alt="Traditional Press" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#f5f5f0] rounded-full flex items-center justify-center p-12 shadow-xl border border-[#1a1a1a]/5">
              <div className="text-center space-y-2">
                <History className="mx-auto text-[#5A5A40]" size={32} />
                <p className="text-[10px] uppercase tracking-widest font-bold">Time-Honored Techniques</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#1a1a1a] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-24">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">Our Foundation</span>
            <h2 className="text-5xl font-light italic">Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-8 p-12 bg-white/5 rounded-[60px] hover:bg-white/10 transition-all duration-500">
              <div className="w-16 h-16 bg-[#5A5A40] rounded-full flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-medium italic">Authenticity</h3>
                <p className="text-sm text-white/40 leading-relaxed">We never compromise on the traditional wood-pressing process, no matter the scale.</p>
              </div>
            </div>
            <div className="space-y-8 p-12 bg-white/5 rounded-[60px] hover:bg-white/10 transition-all duration-500">
              <div className="w-16 h-16 bg-[#5A5A40] rounded-full flex items-center justify-center">
                <Leaf size={24} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-medium italic">Sustainability</h3>
                <p className="text-sm text-white/40 leading-relaxed">From sourcing to packaging, we prioritize the health of our planet as much as yours.</p>
              </div>
            </div>
            <div className="space-y-8 p-12 bg-white/5 rounded-[60px] hover:bg-white/10 transition-all duration-500">
              <div className="w-16 h-16 bg-[#5A5A40] rounded-full flex items-center justify-center">
                <Heart size={24} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-medium italic">Community</h3>
                <p className="text-sm text-white/40 leading-relaxed">Supporting local farmers and empowering rural artisans is at the heart of what we do.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Founders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" alt="Founder" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="px-4">
                  <p className="text-sm font-bold uppercase tracking-widest">Rajesh Kumar</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Master Presser</p>
                </div>
              </div>
              <div className="space-y-4 mt-12">
                <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop" alt="Founder" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="px-4">
                  <p className="text-sm font-bold uppercase tracking-widest">Meera Devi</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Quality Head</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A5A40]">The Faces Behind</span>
            <h2 className="text-5xl md:text-6xl font-light italic leading-tight">Crafted by <br />Human Hands</h2>
            <p className="text-lg text-[#1a1a1a]/60 leading-relaxed">
              Our team consists of traditional artisans who have mastered the art of 
              wood-pressing over generations. Their intuition and expertise are 
              what make Zaza Oils truly special.
            </p>
            <div className="flex space-x-12 pt-8">
              <div className="flex items-center space-x-4">
                <Award className="text-[#5A5A40]" size={24} />
                <p className="text-xs font-bold uppercase tracking-widest">Certified Organic</p>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="text-[#5A5A40]" size={24} />
                <p className="text-xs font-bold uppercase tracking-widest">Fair Trade</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
