import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import heroImage from '../../assets/images/crave_hero_banner_1779190446538.png';

export default function Hero() {
  return (
    <section className="relative h-[500px] w-full overflow-hidden rounded-[3rem] mt-4 mb-12 shadow-2xl shadow-orange-100">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Luxury Food" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-950/80 via-orange-950/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-12 flex flex-col justify-center">
        <div className="max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-6 rounded-full bg-primary/10 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
              Elite Dining Experience
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl md:text-[7rem] font-black text-white tracking-tighter leading-[0.8] drop-shadow-2xl"
          >
            Taste the <br />
            <span className="text-primary italic relative">
              Difference.
              <svg className="absolute -bottom-4 left-0 w-full h-8 text-primary/40 -z-10" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 15 Q 50 0 100 15" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl text-orange-50/70 max-w-md leading-tight font-medium"
          >
            Curated selection of world-class cuisines, delivered to your doorstep with obsessive care.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap gap-4 pt-6"
          >
            <button className="px-12 py-6 bg-primary text-white font-black rounded-theme hover:bg-primary-hover transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 shadow-2xl shadow-orange-500/40 text-lg uppercase tracking-widest">
              Explore Cuisines
              <ArrowRight size={24} className="stroke-[3px]" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
