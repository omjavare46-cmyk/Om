import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Order } from '../types';
import { motion } from 'motion/react';
import { CheckCircle, Clock, Package, Truck, Home, ArrowLeft } from 'lucide-react';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'orders', id), (snapshot) => {
      if (snapshot.exists()) {
        setOrder({ id: snapshot.id, ...snapshot.data() } as Order);
      }
      setLoading(false);
    }, (error) => {
      console.error('Order tracking error:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading live tracker...</div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  const steps = [
    { key: 'pending', label: 'Order Received', icon: CheckCircle },
    { key: 'preparing', label: 'Chef is cooking', icon: Clock },
    { key: 'out_for_delivery', label: 'On its way', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Home },
  ];

  const currentIdx = steps.findIndex(s => s.key === order.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 pt-12 space-y-12 pb-20"
    >
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] bg-white px-6 py-2 rounded-2xl border border-orange-100 shadow-sm hover:text-orange-600 transition-colors">
          <ArrowLeft size={14} />
          Back Home
        </Link>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order #ID: {order.id.slice(-8)}</span>
      </div>

      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200">
           <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
           Live Satellite Feed
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-slate-900 leading-[0.85]">
          {order.status === 'delivered' ? 'Food arrived!' : "We're on it."}
        </h1>
        <p className="text-slate-400 font-medium max-w-sm mx-auto leading-tight">
          Estimated arrival in 15 mins • Delivery for {order.deliveryAddress.split(',')[0]}
        </p>
      </section>

      {/* Progress Stepper */}
      <div className="relative flex justify-between items-center pt-8 px-10">
        <div className="absolute top-[4.5rem] left-20 right-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-1000 ease-in-out" 
            style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-6 group">
              <div 
                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 ${
                  isDone ? 'bg-orange-500 text-white shadow-2xl shadow-orange-500/40' : 'bg-slate-50 text-slate-200'
                } ${isCurrent ? 'scale-125' : ''}`}
              >
                <Icon size={idx === currentIdx ? 32 : 24} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
         <div className="bg-white rounded-[3rem] p-10 border border-orange-100 shadow-sm space-y-8">
            <h3 className="text-2xl font-black text-slate-900">Items Manifest</h3>
            <div className="space-y-4">
               {order.items.map(item => (
                 <div key={item.id} className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border-2 border-transparent hover:border-orange-100 transition-all">
                    <div className="flex items-center gap-4">
                       <span className="text-3xl">{item.emoji || '🍔'}</span>
                       <div>
                          <p className="font-black text-slate-900 leading-none">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                       </div>
                    </div>
                    <span className="text-lg font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-orange-200 space-y-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px]"></div>
            <div className="relative z-10">
               <h3 className="text-2xl font-black mb-4">Elite Support</h3>
               <p className="text-slate-400 font-medium leading-relaxed">Our support team is available 24/7. Your delivery partner is John, he is currently at the restaurant.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
               <button className="py-5 bg-white text-slate-900 font-black rounded-[2rem] hover:bg-orange-50 transition-all active:scale-95 shadow-xl">
                  Chat with Courier
               </button>
               <button className="py-5 bg-white/5 text-white font-black rounded-[2rem] hover:bg-white/10 transition-all border border-white/10 active:scale-95">
                  Call Concierge
               </button>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
