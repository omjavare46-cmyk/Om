import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Order } from '../types';
import { motion } from 'motion/react';
import { LogOut, Settings, History, MapPin, Heart, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, profile, logout, login } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => {
          const data = doc.data();
          // Handle Firestore Timestamp
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
          return { id: doc.id, ...data, createdAt } as Order;
        });
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Fetch orders error:', error);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 glass-card p-20 rounded-[4rem]">
        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto">
          <UserIcon size={48} className="stroke-[1.5px]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tight">Access Restricted</h2>
          <p className="text-slate-400 font-medium">Please authenticate to manage your elite profile.</p>
        </div>
        <button onClick={login} className="btn-primary">
          Sign In to Account
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 pt-12"
    >
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="lg:w-80 shrink-0 space-y-8">
           <div className="bg-white rounded-[3.5rem] p-12 text-center space-y-6 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-primary/5"></div>
              <div className="relative z-10">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                  className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl mx-auto object-cover"
                />
              </div>
              <div className="relative z-10 space-y-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user.displayName}</h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{user.email}</p>
              </div>
           </div>

           <nav className="bg-white rounded-[3.5rem] p-8 border border-slate-100 shadow-sm space-y-3">
              <button className="w-full flex items-center gap-4 p-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20">
                <History size={20} className="stroke-[2.5px]" />
                Order History
              </button>
              <button className="w-full flex items-center gap-4 p-5 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all">
                <Heart size={20} />
                Saved Dishes
              </button>
              <button className="w-full flex items-center gap-4 p-5 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all">
                <MapPin size={20} />
                Shipping Info
              </button>
              <button className="w-full flex items-center gap-4 p-5 text-slate-400 hover:bg-slate-50 hover:text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all text-left">
                <Settings size={20} />
                Account
              </button>
              <div className="pt-4 border-t border-slate-50">
                <button 
                  onClick={async () => { await logout(); navigate('/'); }}
                  className="w-full flex items-center gap-4 p-5 text-red-500 hover:bg-red-50 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
           </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 space-y-8">
            <section className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-sm">
               <div className="flex justify-between items-center mb-12">
                  <h2 className="text-4xl font-black tracking-tighter">Your Journey</h2>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    {orders.length} Deliveries
                  </div>
               </div>
               
               <div className="space-y-6">
                  {orders.length === 0 ? (
                    <div className="p-20 text-center bg-slate-50/50 rounded-[3.5rem] border-2 border-dashed border-slate-100">
                       <p className="text-slate-400 font-bold italic mb-6">Your history is a blank canvas. Let's paint it with flavor.</p>
                       <button onClick={() => navigate('/')} className="px-10 py-4 bg-slate-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all shadow-xl">Start Exploring</button>
                    </div>
                  ) : (
                    orders.map(order => (
                      <motion.div 
                        key={order.id}
                        whileHover={{ y: -8, scale: 1.01 }}
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="p-10 bg-white rounded-[3rem] border border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-2xl transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 group relative overflow-hidden"
                      >
                         <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <div className="flex gap-8 items-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner">
                               {order.items[0]?.emoji || '🍔'}
                            </div>
                            <div className="space-y-2">
                               <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-primary transition-colors">
                                  {order.restaurantName || 'Restaurant'}
                               </h4>
                               <div className="flex items-center gap-3">
                                  <span className={`text-[9px] px-4 py-1 rounded-full font-black uppercase tracking-[0.2em] border ${
                                    order.status === 'delivered' 
                                      ? 'bg-green-50 text-green-600 border-green-100' 
                                      : 'bg-primary/10 text-primary border-primary/20'
                                  }`}>
                                    {order.status.replace(/_/g, ' ')}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right flex items-center gap-10 w-full sm:w-auto border-t sm:border-t-0 pt-6 sm:pt-0">
                            <div>
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Elite Total</p>
                               <p className="text-3xl font-black text-slate-900 tracking-tighter">${order.total.toFixed(2)}</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                               <History size={24} className="stroke-[2.5px]" />
                            </div>
                         </div>
                      </motion.div>
                    ))
                  )}
               </div>
            </section>
        </div>
      </div>
    </motion.div>
  );
}
