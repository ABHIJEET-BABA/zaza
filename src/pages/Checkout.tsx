import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, CreditCard, Truck, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateGST = () => {
    const STORE_STATE = 'Haryana';
    if (formData.state === STORE_STATE) {
      return { cgst: total * 0.025, sgst: total * 0.025, igst: 0 };
    } else {
      return { cgst: 0, sgst: 0, igst: total * 0.05 };
    }
  };

  const { cgst, sgst, igst } = calculateGST();
  const finalTotal = total + cgst + sgst + igst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order on Server
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal }),
      });
      const order = await orderRes.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_RJPy8y0v2rCLHr',
        amount: order.amount,
        currency: order.currency,
        name: 'Zaza Oils',
        description: 'Purchase of Premium Oils',
        order_id: order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.status === 'success') {
            const orderData = {
              userId: user?.uid || 'guest',
              items: cart,
              total: finalTotal,
              gst: { cgst, sgst, igst },
              status: 'pending',
              shippingAddress: {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode
              },
              paymentStatus: 'paid',
              razorpayPaymentId: response.razorpay_payment_id,
              createdAt: new Date().toISOString()
            };

            // Save to Firestore
            await addDoc(collection(db, 'orders'), orderData);

            // Notify Server (Shiprocket + Email)
            try {
              await fetch('/api/orders/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderData }),
              });
            } catch (notifyError) {
              console.error('Notification Error:', notifyError);
            }

            toast.success('Order placed successfully!');
            clearCart();
            setStep(3);
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#5A5A40' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Checkout Error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-8 max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-light italic">Order Confirmed!</h2>
          <p className="text-[#1a1a1a]/50 text-sm uppercase tracking-widest max-w-md mx-auto">
            Thank you for your purchase. Your order has been placed and is being processed. 
            We'll send you an email with tracking details soon.
          </p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#5A5A40] text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-light italic">Checkout</h1>
        <div className="flex justify-center items-center space-x-4 text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
          <span className={step === 1 ? 'text-[#5A5A40]' : ''}>Shipping</span>
          <div className="w-8 h-px bg-[#1a1a1a]/10"></div>
          <span className={step === 2 ? 'text-[#5A5A40]' : ''}>Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8 bg-white p-10 rounded-[40px] shadow-sm"
                >
                  <div className="flex items-center space-x-3 text-[#5A5A40] mb-8">
                    <Truck size={24} />
                    <h3 className="text-xl font-medium italic">Shipping Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Full Name</label>
                      <input 
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Email Address</label>
                      <input 
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Phone Number</label>
                      <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">City</label>
                      <input 
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                        placeholder="Gurugram"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">State</label>
                      <select 
                        required
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all appearance-none"
                      >
                        <option value="">Select State</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Zip Code</label>
                      <input 
                        required
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-[#f5f5f0] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                        placeholder="122001"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Full Address</label>
                      <textarea 
                        required
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-6 py-4 bg-[#f5f5f0] rounded-[24px] text-sm focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20 transition-all"
                        placeholder="Street address, Apartment, Suite, etc."
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 bg-white p-10 rounded-[40px] shadow-sm"
                >
                  <div className="flex items-center space-x-3 text-[#5A5A40] mb-8">
                    <CreditCard size={24} />
                    <h3 className="text-xl font-medium italic">Payment Method</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 border-2 border-[#5A5A40] rounded-[32px] flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-[#f5f5f0] rounded flex items-center justify-center">
                          <CreditCard size={20} className="text-[#1a1a1a]/40" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Credit / Debit Card</p>
                          <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">Secure encrypted payment</p>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full border-4 border-[#5A5A40] bg-white"></div>
                    </div>

                    <div className="p-8 bg-[#f5f5f0] rounded-[32px] space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Card Number</label>
                        <input 
                          disabled
                          className="w-full px-6 py-4 bg-white rounded-full text-sm"
                          placeholder="**** **** **** 1234"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Expiry Date</label>
                          <input 
                            disabled
                            className="w-full px-6 py-4 bg-white rounded-full text-sm"
                            placeholder="MM / YY"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">CVV</label>
                          <input 
                            disabled
                            className="w-full px-6 py-4 bg-white rounded-full text-sm"
                            placeholder="***"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-bold justify-center">
                      <ShieldCheck size={14} />
                      <span>Your payment information is safe and secure</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center">
              {step === 2 && (
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center space-x-2 text-sm uppercase tracking-widest text-[#1a1a1a]/50 hover:text-[#5A5A40] transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Shipping</span>
                </button>
              )}
              <div className="flex-1"></div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#5A5A40] text-white px-12 py-5 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#4a4a35] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>{step === 1 ? 'Continue to Payment' : 'Complete Purchase'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[40px] shadow-sm space-y-8 sticky top-32">
            <h3 className="text-xl font-medium italic">Order Summary</h3>
            
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center space-x-4">
                  <div className="w-12 h-16 bg-[#f5f5f0] rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">{item.quantity} x ₹{item.price}</p>
                  </div>
                  <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm uppercase tracking-widest pt-6 border-t border-[#1a1a1a]/10">
              <div className="flex justify-between text-[#1a1a1a]/60">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              {cgst > 0 && (
                <div className="flex justify-between text-[#1a1a1a]/60">
                  <span>CGST (2.5%)</span>
                  <span>₹{cgst.toFixed(2)}</span>
                </div>
              )}
              {sgst > 0 && (
                <div className="flex justify-between text-[#1a1a1a]/60">
                  <span>SGST (2.5%)</span>
                  <span>₹{sgst.toFixed(2)}</span>
                </div>
              )}
              {igst > 0 && (
                <div className="flex justify-between text-[#1a1a1a]/60">
                  <span>IGST (5%)</span>
                  <span>₹{igst.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#1a1a1a]/60">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="pt-4 border-t border-[#1a1a1a]/10 flex justify-between text-lg font-bold text-[#1a1a1a]">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
