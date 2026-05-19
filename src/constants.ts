import { Restaurant, MenuItem } from './types';

export const CATEGORIES = [
  { id: 'burgers', name: 'Burgers', emoji: '🍔' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'sushi', name: 'Sushi', emoji: '🍣' },
  { id: 'healthy', name: 'Healthy', emoji: '🥗' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' },
  { id: 'asian', name: 'Asian', emoji: '🍜' },
];

export const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: 'res-1',
    name: 'Burger Theory',
    cuisine: 'American',
    rating: 4.8,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    categories: ['burgers', 'fast-food'],
    isOpen: true,
    description: 'Artisanal burgers with premium wagyu beef and secret theory sauce.'
  },
  {
    id: 'res-2',
    name: 'Mizu Sushi',
    cuisine: 'Japanese',
    rating: 4.9,
    deliveryTime: '30-45 min',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    categories: ['sushi', 'asian'],
    isOpen: true,
    description: 'Freshly caught fish and traditional Edomae style sushi.'
  },
  {
    id: 'res-3',
    name: 'La Piazza',
    cuisine: 'Italian',
    rating: 4.7,
    deliveryTime: '25-40 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    categories: ['pizza', 'italian'],
    isOpen: true,
    description: 'Wood-fired pizzas and homemade pasta from family recipes.'
  }
];

export const SEED_MENU: Record<string, MenuItem[]> = {
  'res-1': [
    { id: 'm1', restaurantId: 'res-1', name: 'Classic Theory', description: 'Beef patty, lettuce, tomato, theory sauce', price: 12.99, category: 'Main', emoji: '🍔' },
    { id: 'm2', restaurantId: 'res-1', name: 'Truffle Burger', description: 'Double beef, sautéed mushrooms, truffle aioli', price: 16.99, category: 'Main', emoji: '🍄' },
    { id: 'm3', restaurantId: 'res-1', name: 'Sweet Potato Fries', description: 'Crispy and lightly salted', price: 5.99, category: 'Sides', emoji: '🍟' },
  ],
  'res-2': [
    { id: 'm4', restaurantId: 'res-2', name: 'Salmon Omakase', description: '8 pieces of premium salmon nigiri', price: 24.99, category: 'Main', emoji: '🍣' },
    { id: 'm5', restaurantId: 'res-2', name: 'Spicy Tuna Roll', description: 'Tuna, spicy mayo, cucumber', price: 14.99, category: 'Main', emoji: '🍱' },
    { id: 'm6', restaurantId: 'res-2', name: 'Miso Soup', description: 'Traditional dash broth with tofu', price: 4.99, category: 'Sides', emoji: '🥣' },
  ],
  'res-3': [
    { id: 'm7', restaurantId: 'res-3', name: 'Margherita', description: 'San Marzano tomato, buffalo mozzarella, basil', price: 15.99, category: 'Main', emoji: '🍕' },
    { id: 'm8', restaurantId: 'res-3', name: 'Carbonara', description: 'Guanciale, pecorino, egg yolk, black pepper', price: 18.99, category: 'Main', emoji: '🍝' },
    { id: 'm9', restaurantId: 'res-3', name: 'Tiramisu', description: 'Coffee-soaked ladyfingers, mascarpone', price: 8.99, category: 'Dessert', emoji: '🍰' },
  ]
};
