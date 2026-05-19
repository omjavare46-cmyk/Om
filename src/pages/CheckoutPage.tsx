import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(profile?.address || '');
  const [processing, setProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user) return alert('Please login to place an order.');
    if (!address) return alert('Please provide a delivery address.');
    
    setProcessing(true);
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        restaurantId: items[0].restaurantId,
        restaurantName: items[0].restaurantName,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, emoji: i.emoji })),
        total,
        status: 'pending',
        createdAt: serverTimestamp(),
        deliveryAddress: address
      });
      
      clearCart();
      navigate(`/orders/${orderRef.id}`);
    } catch (error) {
      console.error('Order Error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your bag is empty</h2>
        <button onClick={() => navigate('/')} className="text-orange-600 font-bold underline">Go find some food</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 pt-12"
    >
      <h1 className="text-5xl font-black tracking-tighter mb-12 text-slate-900">Finalize Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-10">
          {/* Address Section */}
          <section className="bg-white rounded-[3rem] p-10 border border-orange-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Delivery Address</h2>
            </div>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full street address, apartment number, and zip code..."
              className="w-full p-8 bg-slate-50 rounded-[2.5rem] border-2 border-transparent focus:border-orange-400 outline-none transition-all h-40 text-slate-700 leading-relaxed font-medium"
            />
          </section>

          {/* Payment Section */}
          <section className="bg-white rounded-[3rem] p-10 border border-orange-100 shadow-sm space-y-6">
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Payment Method</h2>
            </div>
            <div className="p-8 bg-slate-900 rounded-[3rem] text-white shadow-2xl shadow-orange-200 relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
               <div className="flex justify-between items-start mb-16 relative z-10">
                  <span className="font-black tracking-[0.2em] italic text-sm opacity-50 uppercase">Tasty Food Platinum</span>
                  <div className="w-12 h-8 bg-white/10 rounded-xl border border-white/10"></div>
               </div>
               <div className="space-y-2 relative z-10">
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Connected Account</p>
                  <p className="text-2xl font-black tracking-widest">•••• •••• •••• 4492</p>
               </div>
            </div>
          </section>
        </div>

        {/* Order Summary Pane */}
        <div className="bg-white rounded-[3rem] p-10 border border-orange-100 shadow-2xl h-fit space-y-8">
           <h3 className="text-2xl font-black flex items-center gap-2 text-slate-900">
             <Truck className="text-orange-500" />
             Order Summary
           </h3>

           <div className="space-y-6 border-b border-orange-50 pb-8">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl">{item.emoji || '🍕'}</div>
                     <div>
                        <p className="font-black text-slate-900 leading-none">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{item.quantity} units</p>
                     </div>
                  </div>
                  <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
           </div>

           <div className="space-y-4">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                 <span>Subtotal</span>
                 <span className="text-slate-900">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                 <span>Delivery Fee</span>
                 <span className="text-green-500 underline underline-offset-4">FREE</span>
              </div>
              <div className="flex justify-between text-3xl font-black pt-6 text-slate-900">
                 <span>Total</span>
                 <span className="text-orange-500">${total.toFixed(2)}</span>
              </div>
           </div>

           <button 
             onClick={handlePlaceOrder}
             disabled={processing}
             className="w-full py-6 bg-orange-500 text-white font-black rounded-[2.5rem] hover:bg-orange-600 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-orange-200 text-lg"
           >
             {processing ? (
               <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
             ) : (
               <>
                 <CheckCircle size={22} className="stroke-[3px]" />
                 <span>Pay & Order Now</span>
               </>
             )}
           </button>
           <p className="text-[10px] text-slate-400 text-center uppercase tracking-[0.2em] font-black">Secure verification by Tasty Food Dashboard</p>
        </div>
      </div>
    </motion.div>
  );
}
