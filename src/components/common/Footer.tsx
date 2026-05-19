import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-500 py-20 px-8 rounded-t-[4rem] mt-12 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">T</div>
            <span className="text-2xl font-bold tracking-tight text-white italic">Tasty Food</span>
          </Link>
          <p className="text-sm leading-relaxed">The standard in premium food delivery. Curated restaurants, elite service, and a vibrant taste for life.</p>
        </div>
        
        <div>
          <h4 className="text-white font-black mb-6 text-xs uppercase tracking-[0.2em]">Explore</h4>
          <ul className="space-y-4 text-sm font-bold">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Restaurants</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Cuisines</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Gift Cards</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-black mb-6 text-xs uppercase tracking-[0.2em]">Support</h4>
          <ul className="space-y-4 text-sm font-bold">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Safety</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Terms</a></li>
          </ul>
        </div>

        <div>
           <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 text-center sm:text-left">
              <h4 className="text-white font-black mb-2 text-sm uppercase">Get the app</h4>
              <p className="text-[10px] font-bold text-slate-600 mb-6 uppercase tracking-widest">Experience Tasty Food on your device</p>
              <div className="space-y-3">
                 <div className="h-12 bg-white/10 rounded-2xl border border-white/5"></div>
                 <div className="h-12 bg-white/10 rounded-2xl border border-white/5"></div>
              </div>
           </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest leading-none">
        <p>© 2026 Tasty Food. Stay Vibrant.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
        </div>
      </div>
    </footer>
  );
}
