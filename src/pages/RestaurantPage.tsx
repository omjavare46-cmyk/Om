import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SEED_RESTAURANTS, SEED_MENU } from '../constants';
import { Restaurant, MenuItem } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Clock, Info, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function RestaurantPage() {
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    const res = SEED_RESTAURANTS.find(r => r.id === id);
    if (res) {
      setRestaurant(res);
      setMenu(SEED_MENU[id!] || []);
    }
  }, [id]);

  if (!restaurant) return <div className="p-20 text-center">Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 pt-8"
    >
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-colors mb-8 font-black uppercase text-[10px] tracking-[0.2em] bg-white px-6 py-2 rounded-2xl border border-orange-100 shadow-sm">
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Restaurant Header & Info */}
        <div className="lg:w-2/3 space-y-12">
          <section className="space-y-6">
            <div className="relative h-96 rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-100">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-12 left-12 text-white">
                 <h1 className="text-6xl font-black tracking-tighter mb-2">{restaurant.name}</h1>
                 <p className="opacity-80 font-medium max-w-xl text-lg leading-tight">{restaurant.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-12 py-10 border-b border-orange-50">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Elite Rating</span>
                  <div className="flex items-center gap-2 text-2xl font-black text-slate-900">
                    <Star size={24} className="text-yellow-400 fill-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fast Delivery</span>
                  <div className="flex items-center gap-2 text-2xl font-black text-slate-900">
                    <Clock size={24} className="text-orange-500" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Classic Cuisine</span>
                  <span className="text-2xl font-black text-slate-900">{restaurant.cuisine}</span>
               </div>
            </div>
          </section>

          {/* Menu Sections */}
          <section className="space-y-12">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">The Cravings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
              {menu.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white rounded-[3rem] border border-orange-50 shadow-sm flex justify-between gap-6 group hover:border-orange-200 hover:shadow-xl transition-all relative"
                >
                  {idx === 0 && (
                    <div className="absolute -top-3 left-8 px-4 py-1.5 bg-slate-950 text-white border border-white/20 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-xl z-20">
                      Chef's Signature
                    </div>
                  )}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                       <span className="text-4xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                       <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors leading-none tracking-tight">{item.name}</h3>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-snug line-clamp-2">{item.description}</p>
                    <div className="text-2xl font-black text-primary pt-2">${item.price.toFixed(2)}</div>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      ...item,
                      quantity: 1,
                      restaurantName: restaurant.name
                    })}
                    className="self-end p-4 bg-orange-50 text-primary rounded-[1.5rem] hover:bg-primary hover:text-white transition-all transform active:scale-90 shadow-sm group-hover:shadow-lg"
                  >
                    <Plus size={24} className="stroke-[3px]" />
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Cart Summary */}
        <div className="lg:w-1/3">
           <div className="sticky top-24 space-y-6">
             <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl shadow-orange-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-3 mb-10 relative z-10">
                  <ShoppingBag className="text-orange-500" />
                  <h3 className="text-2xl font-black tracking-tight">Your Bag</h3>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar relative z-10">
                  {items.length === 0 ? (
                    <div className="py-10 text-center">
                       <p className="text-slate-500 font-bold italic mb-2">Feeling hungry?</p>
                       <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Select items from the menu</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center gap-4 border-b border-white/5 pb-6">
                        <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-black text-orange-500">{item.quantity}x</span>
                             <span className="font-black text-sm text-slate-100">{item.name}</span>
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1 block">${item.price.toFixed(2)}</span>
                        </div>
                        <span className="font-black text-orange-400 text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>

                {items.length > 0 && (
                  <div className="mt-10 pt-10 border-t border-white/5 space-y-8 relative z-10">
                    <div className="flex justify-between items-center text-3xl font-black">
                       <span className="text-slate-400 text-sm font-black uppercase tracking-widest">Total Amount</span>
                       <span className="text-orange-500">${items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}</span>
                    </div>
                    <Link 
                      to="/checkout"
                      className="block w-full py-6 bg-orange-500 text-white text-center font-black rounded-[2rem] hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/40 text-lg active:scale-95"
                    >
                      Process Checkout
                    </Link>
                  </div>
                )}
             </div>

             <div className="bg-white rounded-[2.5rem] p-8 border border-orange-100 flex items-start gap-4 shadow-sm">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                  <Info size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Delivery</p>
                   <p className="text-sm font-bold text-slate-900 leading-snug">Arrival within {restaurant.deliveryTime}. Tracking opens after payment.</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
