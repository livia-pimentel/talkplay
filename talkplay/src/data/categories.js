import lionIcon from '../assets/images/categories/lion.png';
import fruitsIcon from '../assets/images/categories/fruits.png';
import toysIcon from '../assets/images/categories/toys.png';


export const categories = [
  {
    id: 'animals',
    name: 'Animals',
    icon: lionIcon,
    gradient: ['#FFBE0B', '#FB5607']  // Yellow to Orange
  },
  {
    id: 'foods',
    name: 'Foods',
    icon: fruitsIcon,
    gradient: ['#06FFA5', '#06D6A0']  // Green to Teal
  },
  {
    id: 'toys',
    name: 'Toys',
    icon: toysIcon,
    gradient: ['#8338EC', '#FF006E']  // Purple to Pink
  }
];