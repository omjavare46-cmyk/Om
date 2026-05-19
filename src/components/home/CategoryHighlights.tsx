import { CATEGORIES } from '../../constants';
import { motion } from 'motion/react';

export default function CategoryHighlights() {
  return (
    <section className="py-8 overflow-x-auto no-scrollbar">
      <div className="flex gap-4 pb-2">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex-shrink-0 group cursor-pointer"
          >
            <div className={`px-8 py-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-1 transition-all shadow-sm active:scale-95 border-2 ${
              idx === 0 
                ? 'bg-yellow-400 border-yellow-400 shadow-xl shadow-yellow-200' 
                : 'bg-white border-transparent hover:border-orange-200'
            }`}>
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{cat.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
