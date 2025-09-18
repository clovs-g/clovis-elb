import cookie1 from '../../images/coockies/Chocolate Chip Cookies.jpg';
import { Product } from '../types';

export const products: Product[] = [
  // Cakes
  {
    id: '1',
    name: 'Classic Vanilla Bean',
    description: 'Creamy vanilla bean frosting, layered with fresh berries',
    price: 45,
    category: 'Cakes',
    image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'classic-vanilla-bean',
    sizes: [
      { size: '6-inch', price: 15 },
      { size: '8-inch', price: 25 },
      { size: '10-inch', price: 35 }
    ],
    ingredients: ['Premium vanilla beans', 'Fresh cream', 'Organic flour', 'Farm-fresh eggs', 'Mixed berries'],
    allergens: ['Eggs', 'Dairy', 'Gluten'],
    dietaryInfo: ['Vegetarian']
  },
  {
    id: '2',
    name: 'Decadent Chocolate Fudge',
    description: 'Rich chocolate cake with ganache filling',
    price: 20, // update base price to match 6-inch
    category: 'Cakes',
    image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'decadent-chocolate-fudge',
    sizes: [
      { size: '6-inch', price: 20 },
      { size: '8-inch', price: 40 },
      { size: '10-inch', price: 55 }
    ],
    ingredients: ['Belgian dark chocolate', 'Cocoa powder', 'Heavy cream', 'Butter', 'Organic flour'],
    allergens: ['Eggs', 'Dairy', 'Gluten'],
    dietaryInfo: ['Vegetarian']
  },
  {
    id: '3',
    name: 'Red Velvet Dream',
    description: 'Classic red velvet with cream cheese frosting',
    price: 48,
    category: 'Cakes',
    image: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'red-velvet-dream',
    sizes: [
      { size: '6-inch', price: 7 },
      { size: '8-inch', price: 12 },
      { size: '10-inch', price: 20 }
    ],
    ingredients: ['Buttermilk', 'Cream cheese', 'Red food coloring', 'Cocoa powder', 'Vanilla extract'],
    allergens: ['Eggs', 'Dairy', 'Gluten'],
    dietaryInfo: ['Vegetarian']
  },
  // Cupcakes
  {
    id: '4',
    name: 'Assorted Dozen',
    description: 'Mix of daily flavors including vanilla, chocolate, and seasonal specials',
    price: 30,
    category: 'Cupcakes',
    image: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'assorted-dozen-cupcakes',
    ingredients: ['Assorted premium ingredients', 'Buttercream frosting', 'Seasonal decorations'],
    allergens: ['Eggs', 'Dairy', 'Gluten'],
    dietaryInfo: ['Vegetarian']
  },
  {
    id: '5',
    name: 'Single Cupcake',
    description: 'Choose from our daily selection of gourmet cupcakes',
    price: 5,
    category: 'Cupcakes',
    image: 'https://images.pexels.com/photos/1055270/pexels-photo-1055270.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'single-cupcake',
    ingredients: ['Premium flour', 'Fresh butter', 'Vanilla extract', 'Buttercream frosting'],
    allergens: ['Eggs', 'Dairy', 'Gluten'],
    dietaryInfo: ['Vegetarian']
  },
  // Pastries
  {
    id: '6',
    name: 'Butter Croissant',
    description: 'Flaky and golden, made with premium European butter',
    price: 3.5,
    category: 'Pastries',
    image: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'butter-croissant',
    ingredients: ['European butter', 'French flour', 'Fresh yeast', 'Sea salt'],
    allergens: ['Gluten', 'Dairy'],
    dietaryInfo: ['Vegetarian']
  },
  {
    id: '7',
    name: 'Pain au Chocolat',
    description: 'Buttery croissant with premium dark chocolate',
    price: 4,
    category: 'Pastries',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'pain-au-chocolat',
    ingredients: ['European butter', 'Belgian dark chocolate', 'French flour', 'Fresh yeast'],
    allergens: ['Gluten', 'Dairy'],
    dietaryInfo: ['Vegetarian']
  },
  // Cookies
  {
    id: '8',
    name: 'Chocolate Chip Cookie',
    description: 'Classic recipe with Belgian chocolate chips',
    price: 2.5,
    category: 'Cookies',
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'chocolate-chip-cookie',
    ingredients: ['Belgian chocolate chips', 'Brown sugar', 'Vanilla extract', 'Sea salt'],
    allergens: ['Eggs', 'Dairy', 'Gluten'],
    dietaryInfo: ['Vegetarian']
  },
  {
    id: '9',
    name: 'Oatmeal Raisin Cookie',
    description: 'Hearty oats with plump raisins and warm spices',
    price: 2.75,
    category: 'Cookies',
    image: cookie1,
    slug: 'oatmeal-raisin-cookie',
    ingredients: ['Rolled oats', 'Plump raisins', 'Cinnamon', 'Brown sugar', 'Vanilla'],
    allergens: ['Eggs', 'Dairy', 'Gluten'],
    dietaryInfo: ['Vegetarian']
  },
  // Breads
  {
    id: '10',
    name: 'Artisan Sourdough',
    description: 'Traditional sourdough with crispy crust and tangy flavor',
    price: 6,
    category: 'Breads',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'artisan-sourdough',
    ingredients: ['Sourdough starter', 'Organic flour', 'Sea salt', 'Filtered water'],
    allergens: ['Gluten'],
    dietaryInfo: ['Vegan']
  },
  {
    id: '11',
    name: 'Multigrain Loaf',
    description: 'Healthy blend of seeds and grains, soft texture',
    price: 5.5,
    category: 'Breads',
    image: 'https://images.pexels.com/photos/1586947/pexels-photo-1586947.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    slug: 'multigrain-loaf',
    ingredients: ['Whole wheat flour', 'Sunflower seeds', 'Pumpkin seeds', 'Flax seeds', 'Honey'],
    allergens: ['Gluten'],
    dietaryInfo: ['Vegetarian']
  }
];