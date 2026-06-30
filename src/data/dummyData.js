const localImages = [
  require('../../assets/img1.jpg'),
  require('../../assets/img2.webp'),
  require('../../assets/img3.webp'),
  require('../../assets/img4.webp'),
];

const getRandomImage = () => localImages[Math.floor(Math.random() * localImages.length)];

export const dummyProducts = [
  {
    id: '1',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    image: getRandomImage(),
    platform: 'Amazon',
    url: 'https://amazon.com/dp/B09XS7JWHH',
    savedPrice: '₹28,990',
    category: 'Electronics',
    notes: 'Wait for Black Friday deal',
    createdAt: '2026-06-25T10:30:00Z',
  },
  {
    id: '2',
    name: 'Nike Air Max 270',
    image: getRandomImage(),
    platform: 'Myntra',
    url: 'https://myntra.com/nike-air-max-270',
    savedPrice: '₹12,495',
    category: 'Fashion',
    notes: 'Size 10, prefer black color',
    createdAt: '2026-06-28T14:15:00Z',
  },
  {
    id: '3',
    name: 'Apple MacBook Air M3',
    image: getRandomImage(),
    platform: 'Flipkart',
    url: 'https://flipkart.com/macbook-air-m3',
    savedPrice: '₹1,09,900',
    category: 'Electronics',
    notes: 'Need minimum 16GB RAM for dev work',
    createdAt: '2026-06-29T09:00:00Z',
  },
  {
    id: '4',
    name: 'Dyson V15 Detect Vacuum',
    image: getRandomImage(),
    platform: 'Amazon',
    url: 'https://amazon.com/dp/B08X9ZQ3Q1',
    savedPrice: '₹54,900',
    category: 'Home',
    notes: '',
    createdAt: '2026-06-30T08:45:00Z',
  },
  {
    id: '5',
    name: 'Levi\'s Men\'s 501 Original Fit Jeans',
    image: getRandomImage(),
    platform: 'Ajio',
    url: 'https://ajio.com/levis-501',
    savedPrice: '₹3,599',
    category: 'Fashion',
    notes: 'Check for waist size 32',
    createdAt: '2026-06-30T10:20:00Z',
  }
];

export const dummyCategories = [
  'All',
  'Electronics',
  'Fashion',
  'Home',
  'Beauty',
  'Grocery',
  'Books',
  'Others'
];
