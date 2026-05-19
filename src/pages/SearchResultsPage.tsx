import { useSearchParams } from 'react-router-dom';
import { SEED_RESTAURANTS } from '../constants';
import RestaurantCard from '../components/restaurants/RestaurantCard';
import { motion } from 'motion/react';
import { Search, Filter, Star, X } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const cuisine = searchParams.get('cuisine') || '';
  const minRating = Number(searchParams.get('minRating')) || 0;

  const filteredRestaurants = SEED_RESTAURANTS.filter(res => {
    const matchesQuery = res.name.toLowerCase().includes(query.toLowerCase()) || 
                        res.cuisine.toLowerCase().includes(query.toLowerCase());
    const matchesCuisine = !cuisine || res.cuisine === cuisine;
    const matchesRating = res.rating >= minRating;
    return matchesQuery && matchesCuisine && matchesRating;
  });

  const uniqueCuisines = Array.from(new Set(SEED_RESTAURANTS.map(r => r.cuisine)));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">
            {query ? `Results for "${query}"` : 'All Restaurants'}
          </h1>
          <p className="text-slate-500 font-medium">Found {filteredRestaurants.length} premium spots for you.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Active Filters Display */}
          {cuisine && (
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {cuisine}
              <button 
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete('cuisine');
                  setSearchParams(params);
                }}
                className="hover:scale-125 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          )}
          {minRating > 0 && (
            <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">
              {minRating}+ Stars
              <button 
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete('minRating');
                  setSearchParams(params);
                }}
                className="hover:scale-125 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* Filters Sidebar */}
        <aside className="space-y-10 group">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-32">
            <div className="flex items-center gap-2 mb-8 text-slate-900 font-black uppercase text-xs tracking-widest">
              <Filter size={16} className="text-primary" />
              Refine Search
            </div>

            <div className="space-y-8">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cuisine type</label>
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete('cuisine');
                      setSearchParams(params);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all ${!cuisine ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-500'}`}
                  >
                    All Cuisines
                  </button>
                  {uniqueCuisines.map(c => (
                    <button 
                      key={c}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('cuisine', c);
                        setSearchParams(params);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all ${cuisine === c ? 'bg-primary text-white' : 'hover:bg-slate-50 text-slate-500'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Minimum Rating</label>
                <div className="flex gap-2">
                  {[3, 4, 4.5].map(rating => (
                    <button 
                      key={rating}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('minRating', rating.toString());
                        setSearchParams(params);
                      }}
                      className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1 ${minRating === rating ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      <Star size={12} fill={minRating === rating ? 'currentColor' : 'none'} />
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSearchParams({})}
              className="w-full mt-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors border-t border-slate-50 pt-8"
            >
              Reset all filters
            </button>
          </div>
        </aside>

        {/* Results Grid */}
        <div>
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRestaurants.map((res, idx) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <RestaurantCard restaurant={res} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur-sm rounded-[4rem] border-2 border-dashed border-slate-100 p-24 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 mx-auto mb-8">
                <Search size={48} className="stroke-[1.5px]" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No restaurants found</h3>
              <p className="text-slate-400 font-medium mb-8">Try adjusting your filters or search keywords to find what you're craving.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="btn-primary inline-flex"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
