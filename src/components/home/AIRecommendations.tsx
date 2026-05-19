import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface AIRecommendation {
  name: string;
  description: string;
  cuisine: string;
  price: number;
  emoji: string;
}

export default function AIRecommendations() {
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Check cache first
      const cached = sessionStorage.getItem('ai_recommendations');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecommendations(parsed);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse cached recommendations');
        }
      }

      setLoading(true);
      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            preferences: profile?.preferences || 'Any',
            history: 'No previous orders'
          })
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setRecommendations(data);
          sessionStorage.setItem('ai_recommendations', JSON.stringify(data));
        } else {
          console.warn('Expected array for recommendations, got:', data);
          setRecommendations([]);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [profile]);

  if (loading) return (
    <div className="py-16 max-w-7xl mx-auto px-4 animate-pulse">
      <div className="h-48 bg-neutral-200 rounded-3xl"></div>
    </div>
  );

  if (recommendations.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="bg-slate-950 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-elite">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none rotate-12">
            <Sparkles size={400} />
          </div>

          <div className="relative flex flex-col gap-16">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-white/10">
                <Sparkles size={14} className="text-primary fill-primary" />
                <span>AI Concierge</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.85]">
                Curated for your <br />
                <span className="text-primary italic">Exquisite Taste.</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg leading-snug">
                Our intelligence engine has hand-picked these delicacies based on your unique flavor profile.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {recommendations.map((rec, idx) => (
                <motion.div
                  key={rec.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/5 p-8 group hover:bg-white/10 transition-all duration-500 flex flex-col items-center text-center relative"
                >
                  <div className="absolute top-6 right-8 text-[10px] font-black text-white/20 uppercase tracking-widest italic pt-1">0{idx + 1}</div>
                  <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-700 drop-shadow-2xl">{rec.emoji}</div>
                  <h3 className="font-black text-2xl leading-tight mb-2 tracking-tight">{rec.name}</h3>
                  <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-6">
                    {rec.cuisine} Edition
                  </p>
                  <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed line-clamp-2">
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between w-full mt-auto bg-white/5 p-4 rounded-[2rem] border border-white/5 group-hover:bg-primary/20 transition-all">
                    <span className="text-2xl font-black text-white ml-2">${rec.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart({
                        id: `ai-${idx}`,
                        name: rec.name,
                        price: rec.price,
                        quantity: 1,
                        restaurantId: 'ai-gen',
                        restaurantName: 'AI Choice',
                        emoji: rec.emoji
                      })}
                      className="w-12 h-12 bg-primary text-white rounded-2xl hover:bg-white hover:text-primary transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center justify-center group-hover:rotate-90"
                    >
                      <Plus size={24} className="stroke-[3px]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
