import { Ingredient } from './types';

export const INGREDIENTS_POOL: Ingredient[] = [
  // Good items
  {
    id: 'tea_leaves',
    name: 'Tea Leaves',
    hindiName: 'Chai Patti',
    emoji: '🌿',
    category: 'good',
    points: 10,
    description: 'Fresh aromatic leaves from Assam gardens!'
  },
  {
    id: 'milk',
    name: 'Pure Milk',
    hindiName: 'Doodh',
    emoji: '🥛',
    category: 'good',
    points: 10,
    description: 'Rich buffalo milk for that thick creamy texture.'
  },
  {
    id: 'sugar',
    name: 'Sugar',
    hindiName: 'Cheeni',
    emoji: '🍬',
    category: 'good',
    points: 10,
    description: 'Perfect sweetness, strictly 2 spoons!'
  },
  {
    id: 'ginger',
    name: 'Ginger',
    hindiName: 'Adrak',
    emoji: '🧄',
    category: 'good',
    points: 15,
    description: 'Crushed spicy adrak makes it kadak!'
  },
  {
    id: 'cardamom',
    name: 'Cardamom',
    hindiName: 'Elaichi',
    emoji: '🟢',
    category: 'good',
    points: 15,
    description: 'Royal aroma to complete the tapree experience!'
  },
  {
    id: 'lemongrass',
    name: 'Lemongrass',
    hindiName: 'Gavati Chaha',
    emoji: '🌱',
    category: 'good',
    points: 15,
    description: 'Fresh herbal zing!'
  },

  // Bad items
  {
    id: 'biscuit',
    name: 'Biscuit',
    hindiName: 'Parle-G',
    emoji: '🍪',
    category: 'bad',
    points: -10,
    description: 'DIP it, do not boil it inside the tea!'
  },
  {
    id: 'samosa',
    name: 'Samosa',
    hindiName: 'Samosa',
    emoji: '🥟',
    category: 'bad',
    points: -10,
    description: 'Oily fried snacks are not meant for boiling.'
  },
  {
    id: 'chili',
    name: 'Chili',
    hindiName: 'Teekhi Mirchi',
    emoji: '🌶️',
    category: 'bad',
    points: -15,
    description: 'Who wants burning spicy tea?! No thanks.'
  },
  {
    id: 'lizard',
    name: 'Lizard',
    hindiName: 'Chipkali',
    emoji: '🦎',
    category: 'bad',
    points: -25,
    description: 'HYGIENE ALERT! Extremely hazardous.'
  },
  {
    id: 'slipper',
    name: 'Slipper',
    hindiName: 'Chappal',
    emoji: '🥿',
    category: 'bad',
    points: -20,
    description: 'Chappal inside tea? Absolute disaster!'
  },
  {
    id: 'coin',
    name: 'Coin',
    hindiName: 'Sikka',
    emoji: '🪙',
    category: 'bad',
    points: -15,
    description: 'Metallic pollution is unauthorized here.'
  },
  {
    id: 'bug',
    name: 'Spider',
    hindiName: 'Makdi',
    emoji: '🕷️',
    category: 'bad',
    points: -15,
    description: 'Clean tapree standards! No spiders allowed!'
  },
  {
    id: 'burger',
    name: 'Burger',
    hindiName: 'Burger',
    emoji: '🍔',
    category: 'bad',
    points: -10,
    description: 'Burgers belong in fast food, not Assam tea!'
  }
];

export const SUCCESS_MEMES = [
  'Ekdum Kadak Boss! 🔥',
  'Arre VIP Cutting Chai Ready! ☕',
  'Shabaash! Vibe check passed! ✨',
  'Dolly level tap-tap skill unlocked! 🕶️',
  'Swaad aa gaya bhaiya! 👍',
  'Superb speed! Chai pe charcha! 🗣️',
  'Aromatic perfection! 🌟'
];

export const ERROR_MEMES = [
  'Ae Raju! Dhyan kidhar hai?!',
  'Moye Moye! Chai barbaad!',
  'Gadha hai kya? Biscuit nahi!',
  'Arey bhai! Samosa mat daal!',
  'Kya kar raha hai? Pagal hai?!',
  'Bhai, chai mein doodh daal na!',
  'Haye! Meri chai! 😭',
  'Abe o! Seedha dekh!',
  'Fir se? Tujhse na ho payega!',
  'Chai wala ro raha hai!',
  'Cutting chai barbaad! 😤',
  'Ae vedya! Ye kya kiya!'
];

export const GAME_OVER_MEMES = [
  'Stall bandh! Go drink plain water! 🚰',
  'Moye Moye! Chai stalls are calling you to wash cups! 🧼',
  'Kettle got ruined, boss. Better luck next time! 💥',
  'No cutting chai for you today. Only black coffee! ☕❌',
  'You made liquid soap instead of masala chai! 🧼✨'
];
