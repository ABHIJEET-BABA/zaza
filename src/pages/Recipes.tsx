import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users, ChefHat, ArrowRight, Play } from 'lucide-react';

const recipes = [
  {
    id: 1,
    title: "Traditional Mustard Tadka",
    description: "The secret to authentic North Indian curries lies in the perfect mustard oil tempering.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop",
    time: "5 mins",
    serves: "4 people",
    difficulty: "Easy",
    ingredients: ["2 tbsp Wood Pressed Mustard Oil", "1 tsp Cumin Seeds", "2 Dried Red Chillies", "A pinch of Hing"],
    steps: [
      "Heat mustard oil in a small pan until it reaches smoking point.",
      "Turn off the heat and let it cool slightly.",
      "Add cumin seeds and let them splutter.",
      "Add red chillies and hing, then pour over your dal or curry."
    ]
  },
  {
    id: 2,
    title: "Coconut Oil Hair Mask",
    description: "Revitalize your hair with this simple, all-natural deep conditioning treatment.",
    image: "https://images.unsplash.com/photo-1590730310295-ce3002a91571?q=80&w=1000&auto=format&fit=crop",
    time: "45 mins",
    serves: "1 person",
    difficulty: "Easy",
    ingredients: ["3 tbsp Virgin Coconut Oil", "1 tbsp Honey", "2 drops Lavender Essential Oil"],
    steps: [
      "Warm the coconut oil until it's liquid.",
      "Mix in honey and essential oil.",
      "Apply to hair from roots to tips.",
      "Leave for 30 minutes and wash with a mild shampoo."
    ]
  },
  {
    id: 3,
    title: "Sesame Oil Body Massage",
    description: "Experience the ancient Ayurvedic practice of Abhyanga for glowing skin and relaxation.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1000&auto=format&fit=crop",
    time: "20 mins",
    serves: "1 person",
    difficulty: "Medium",
    ingredients: ["1/2 cup Premium Sesame Oil", "Warm water", "Soft towel"],
    steps: [
      "Slightly warm the sesame oil.",
      "Massage in circular motions starting from the head down to the feet.",
      "Wait for 15 minutes to let the oil penetrate the skin.",
      "Take a warm bath to rinse off excess oil."
    ]
  }
];

export const Recipes: React.FC = () => {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#f5f5f0]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop" 
            alt="Recipes" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-3xl px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#5A5A40]"
          >
            The Art of Usage
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-light italic leading-tight"
          >
            Recipes & Rituals
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#1a1a1a]/60 text-lg leading-relaxed"
          >
            Discover the many ways to incorporate Zaza Oils into your daily life, 
            from traditional culinary delights to ancient self-care rituals.
          </motion.p>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 gap-24">
          {recipes.map((recipe, index) => (
            <motion.div 
              key={recipe.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#5A5A40] rounded-full flex items-center justify-center text-white shadow-xl hidden md:flex">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">Difficulty</p>
                    <p className="text-xl italic">{recipe.difficulty}</p>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="flex items-center space-x-6 text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                  <div className="flex items-center space-x-2">
                    <Clock size={14} />
                    <span>{recipe.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users size={14} />
                    <span>{recipe.serves}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[#5A5A40]">
                    <ChefHat size={14} />
                    <span>Ritual</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-5xl font-light italic">{recipe.title}</h2>
                  <p className="text-lg text-[#1a1a1a]/60 leading-relaxed">{recipe.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-[#1a1a1a]/5">
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#5A5A40]">Ingredients</h3>
                    <ul className="space-y-2">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i} className="text-sm text-[#1a1a1a]/60 flex items-center space-x-2">
                          <span className="w-1 h-1 bg-[#5A5A40] rounded-full"></span>
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#5A5A40]">Method</h3>
                    <ol className="space-y-4">
                      {recipe.steps.map((step, i) => (
                        <li key={i} className="text-sm text-[#1a1a1a]/60 flex items-start space-x-3">
                          <span className="font-bold text-[#5A5A40] italic">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <button className="flex items-center space-x-3 text-sm uppercase tracking-widest font-bold text-[#5A5A40] group pt-4">
                  <span>Watch Tutorial</span>
                  <div className="w-10 h-10 bg-[#f5f5f0] rounded-full flex items-center justify-center group-hover:bg-[#5A5A40] group-hover:text-white transition-all">
                    <Play size={14} fill="currentColor" />
                  </div>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="bg-[#1a1a1a] text-white p-16 md:p-24 rounded-[60px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#5A5A40] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
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
    </div>
  );
};
