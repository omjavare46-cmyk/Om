import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, MapPin, Search, SlidersHorizontal, Star, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { SEED_RESTAURANTS } from '../../constants';

export default function Header() {
  const { items } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [minRating, setMinRating] = useState(0);
  const filterRef = useRef<HTMLDivElement>(null);

  const cuisines = Array.from(new Set(SEED_RESTAURANTS.map(r => r.cuisine)));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCuisine) params.set('cuisine', selectedCuisine);
    if (minRating > 0) params.set('minRating', minRating.toString());
    
    navigate(`/search?${params.toString()}`);
    setShowFilters(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-card mx-4 mt-4 rounded-[2.5rem] px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">T</div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-primary transition-colors">Tasty<span className="text-primary italic">Food</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.15em] bg-slate-50 border border-slate-100 px-6 py-2.5 rounded-full cursor-pointer hover:bg-white hover:shadow-md transition-all">
            <MapPin size={14} className="text-primary" />
            <span className="text-slate-400">Deliver to:</span>
            <span className="text-slate-900">77th Avenue, NY</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative" ref={filterRef}>
            <form 
              onSubmit={handleSearch}
              className="hidden md:flex items-center relative gap-3 bg-slate-50 px-6 py-2.5 rounded-full border border-slate-100 focus-within:bg-white focus-within:shadow-xl focus-within:border-primary/20 transition-all w-80"
            >
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cravings..." 
                className="bg-transparent border-none outline-none text-xs w-full font-bold text-slate-600 placeholder:text-slate-300 placeholder:uppercase placeholder:font-black placeholder:tracking-widest"
              />
              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-200'}`}
              >
                <SlidersHorizontal size={16} />
              </button>
            </form>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full mt-4 right-0 w-80 bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 p-8 z-50"
                >
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cuisine</label>
                        {selectedCuisine && (
                          <button onClick={() => setSelectedCuisine(null)} className="text-[10px] font-black text-primary uppercase">Reset</button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cuisines.map(c => (
                          <button
                            key={c}
                            onClick={() => setSelectedCuisine(c === selectedCuisine ? null : c)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                              selectedCuisine === c 
                                ? 'bg-primary text-white border-primary shadow-lg shadow-orange-500/20' 
                                : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-primary/20'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Rating</label>
                        {minRating > 0 && (
                          <button onClick={() => setMinRating(0)} className="text-[10px] font-black text-primary uppercase">Any</button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {[3, 4, 4.5].map(r => (
                          <button
                            key={r}
                            onClick={() => setMinRating(r)}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all border flex items-center justify-center gap-1 ${
                              minRating === r 
                                ? 'bg-slate-900 text-white border-slate-900' 
                                : 'bg-slate-50 text-slate-400 border-slate-100'
                            }`}
                          >
                            <Star size={10} fill={minRating === r ? 'currentColor' : 'none'} />
                            {r}+
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSearch()}
                      className="w-full btn-primary !py-3 !text-xs uppercase tracking-widest"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/checkout" className="relative p-3 text-slate-700 hover:text-white hover:bg-slate-900 transition-all bg-white rounded-2xl border border-slate-100 shadow-sm active:scale-90">
              <ShoppingCart size={22} className="stroke-[2.5px]" />
              {items.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg shadow-orange-500/40 border-2 border-white"
                >
                  {items.length}
                </motion.span>
              )}
            </Link>

            {user ? (
              <Link to="/profile" className="flex items-center gap-2 p-1 hover:bg-primary/5 rounded-2xl transition-all border-2 border-transparent hover:border-primary/20 overflow-hidden">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                  alt={user.displayName || 'Profile'} 
                  className="w-11 h-11 rounded-xl object-cover shadow-sm"
                />
              </Link>
            ) : (
              <button 
                onClick={login}
                className="px-8 py-3 text-xs font-black bg-slate-900 text-white rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 active:scale-95"
              >
                <User size={18} />
                <span className="uppercase tracking-widest">Sign In</span>
              </button>
            )}
          </div>
        </div>
    </header>
  );
}
