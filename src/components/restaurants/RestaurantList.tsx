import { SEED_RESTAURANTS } from '../../constants';
import RestaurantCard from './RestaurantCard';

export default function RestaurantList() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Restaurants</h2>
          <p className="text-neutral-500">The most popular spots in your neighborhood.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SEED_RESTAURANTS.map((res) => (
          <RestaurantCard key={res.id} restaurant={res} />
        ))}
      </div>
    </section>
  );
}
