const axios = require('axios');

const products = [
  {
    name: 'Kikuyu Bible',
    category: 'Bibles',
    description: 'Printed Kikuyu Bible from Bible Society of Kenya',
    price: 1500,
    imageUrl: 'https://example.com/kikuyu-bible.jpg',
    stock: 20
  },
  {
    name: 'English Bible',
    category: 'Bibles',
    description: 'New International Version (NIV)',
    price: 1200,
    imageUrl: 'https://example.com/english-bible.jpg',
    stock: 30
  },
  {
    name: 'Verse Bookmark',
    category: 'Gifts & Accessories',
    description: 'Custom bookmark with a favorite Bible verse',
    price: 200,
    imageUrl: 'https://example.com/bookmark.jpg',
    stock: 50
  },
  {
    name: 'Sunday School Chart',
    category: 'Children',
    description: 'Colorful charts with memory verses',
    price: 250,
    imageUrl: 'https://example.com/chart.jpg',
    stock: 40
  },
  {
    name: 'Hymn Book (Kikuyu)',
    category: 'Books',
    description: 'Traditional Kikuyu hymn collection',
    price: 600,
    imageUrl: 'https://example.com/hymn-book.jpg',
    stock: 25
  },
  {
    name: 'Christian Diary',
    category: 'Stationery',
    description: 'Yearly planner with Bible verses',
    price: 450,
    imageUrl: 'https://example.com/diary.jpg',
    stock: 15
  },
  {
    name: 'Gift Bags',
    category: 'Gifts & Accessories',
    description: 'Small gift bags for church occasions',
    price: 100,
    imageUrl: 'https://example.com/gift-bags.jpg',
    stock: 60
  },
  {
    name: 'Pencil Pack',
    category: 'School Supplies',
    description: '10 pencils per pack',
    price: 80,
    imageUrl: 'https://example.com/pencil-pack.jpg',
    stock: 100
  },
  {
    name: 'Exercise Books (A4)',
    category: 'School Supplies',
    description: 'Set of 5 ruled exercise books',
    price: 150,
    imageUrl: 'https://example.com/exercise-books.jpg',
    stock: 70
  },
  {
    name: 'Children\'s Bible',
    category: 'Children',
    description: 'Illustrated Bible stories for kids',
    price: 700,
    imageUrl: 'https://example.com/childrens-bible.jpg',
    stock: 35
  }
];

async function seedProducts() {
  for (const product of products) {
    try {
      const res = await axios.post('http://localhost:5000/api/products', product);
      console.log(`✅ Added: ${product.name}`);
    } catch (err) {
      console.error(`❌ Failed to add: ${product.name}`, err.message);
    }
  }
}

seedProducts();
