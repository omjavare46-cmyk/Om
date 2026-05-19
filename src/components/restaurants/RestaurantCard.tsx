import { Link } from 'react-router-dom';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { Restaurant } from '../../types';
import { motion } from 'motion/react';

interface Props {
  restaurant: Restaurant;
  key?: string | number;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="group block h-full">
      <motion.div 
        whileHover={{ y: -10 }}
        className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all p-5 flex flex-col h-full relative"
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[2rem]">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl border border-white/50">
            <Star size={14} className="fill-primary text-primary" />
            <span className="text-[11px] font-black text-slate-900">{restaurant.rating}</span>
          </div>

          <div className="absolute bottom-4 left-4 bg-primary text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-primary/20 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             Featured Spot
          </div>
        </div>

        <div className="flex flex-col flex-1 pt-6 px-2 pb-2">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{restaurant.name}</h3>
          </div>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-4 flex items-center gap-2">
            {restaurant.cuisine}
            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
            <Clock size={12} />
            {restaurant.deliveryTime}
          </p>
          
          <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
            <span className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-1">
               <span className="text-slate-300 text-[10px] font-medium">$</span> Free Delivery
            </span>
            {!restaurant.isOpen ? (
              <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100">Closed</span>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                 <ArrowRight size={16} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
