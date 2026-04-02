import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from 'lucide-react';
import { toast } from 'sonner';

export const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-[#5A5A40]">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1000&auto=format&fit=crop" 
            alt="Contact Us" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/60"
          >
            Get in Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-light italic text-white"
          >
            Contact Us
          </motion.h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-12 rounded-[40px] shadow-xl space-y-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#5A5A40] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Our Studio</h3>
                    <p className="text-sm leading-relaxed">123 Heritage Lane, Sector 45,<br />Gurugram, Haryana 122003</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#5A5A40] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Call Us</h3>
                    <p className="text-sm">+91 98765 43210</p>
                    <p className="text-sm text-[#1a1a1a]/40 italic">Mon - Sat, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#5A5A40] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Email Us</h3>
                    <p className="text-sm">hello@zazaoils.com</p>
                    <p className="text-sm">support@zazaoils.com</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#1a1a1a]/5 flex space-x-6">
                <a href="#" className="w-10 h-10 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#1a1a1a]/40 hover:bg-[#5A5A40] hover:text-white transition-all">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#1a1a1a]/40 hover:bg-[#5A5A40] hover:text-white transition-all">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-[#f5f5f0] rounded-full flex items-center justify-center text-[#1a1a1a]/40 hover:bg-[#5A5A40] hover:text-white transition-all">
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-12 rounded-[40px] shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Full Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full px-8 py-5 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Email Address</label>
                    <input 
                      required
                      type="email"
                      className="w-full px-8 py-5 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Subject</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-8 py-5 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Message</label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full px-8 py-6 bg-[#f5f5f0] rounded-[32px] text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-[#5A5A40] text-white px-12 py-5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all flex items-center space-x-3 group"
                >
                  <span>Send Message</span>
                  <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="h-[400px] bg-[#f5f5f0] rounded-[40px] overflow-hidden relative group">
          <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop" 
            alt="Map Placeholder" 
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-[32px] shadow-xl text-center space-y-2">
              <MapPin className="mx-auto text-[#5A5A40]" size={32} />
              <p className="text-sm font-bold uppercase tracking-widest">Visit Our Flagship Store</p>
              <p className="text-xs text-[#1a1a1a]/40">Gurugram, Haryana</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
