import Hero from '../components/home/Hero';
import CategoryHighlights from '../components/home/CategoryHighlights';
import AIRecommendations from '../components/home/AIRecommendations';
import RestaurantList from '../components/restaurants/RestaurantList';
import { motion } from 'motion/react';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <Hero />
      <CategoryHighlights />
      <AIRecommendations />
      <RestaurantList />
    </motion.div>
  );
}
