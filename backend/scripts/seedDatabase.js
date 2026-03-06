import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    _id: "1",
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
    price: 1000,
    image: ["/src/assets/p_img1_1.png", "/src/assets/p_img1_2.png", "/src/assets/p_img1_3.png", "/src/assets/p_img1_4.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: new Date(1716634345448),
    bestseller: true,
    stock: 100
  },
  {
    _id: "2",
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline.",
    price: 200,
    image: ["/src/assets/p_img2_1.png", "/src/assets/p_img2_2.png", "/src/assets/p_img2_3.png", "/src/assets/p_img2_4.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: new Date(1716634345449),
    bestseller: true,
    stock: 150
  },
  {
    _id: "3",
    name: "Girls Round Neck Cotton Top",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline.",
    price: 1500,
    image: ["/src/assets/p_img3_1.png", "/src/assets/p_img3_2.png", "/src/assets/p_img3_3.png", "/src/assets/p_img3_4.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: new Date(1716634345450),
    bestseller: false,
    stock: 80
  },
  {
    _id: "4",
    name: "Men Slim Fit Relaxed Denim Jacket",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline.",
    price: 2200,
    image: ["/src/assets/p_img4_1.png", "/src/assets/p_img4_2.png", "/src/assets/p_img4_3.png", "/src/assets/p_img4_4.png"],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["M", "L", "XL"],
    date: new Date(1716634345451),
    bestseller: true,
    stock: 60
  },
  {
    _id: "5",
    name: "Women Palazzo Pants with Elastic Waist",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline.",
    price: 1800,
    image: ["/src/assets/p_img5.png"],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: new Date(1716634345452),
    bestseller: true,
    stock: 120
  },
  {
    _id: "6",
    name: "Kids Hooded Sweatshirt",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline.",
    price: 1400,
    image: ["/src/assets/p_img6.png"],
    category: "Kids",
    subCategory: "Winterwear",
    sizes: ["S", "M"],
    date: new Date(1716634345453),
    bestseller: false,
    stock: 90
  },
  {
    _id: "7",
    name: "Men Tapered Fit Flat-Front Trousers",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline.",
    price: 1900,
    image: ["/src/assets/p_img7.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    date: new Date(1716634345454),
    bestseller: false,
    stock: 70
  },
  {
    _id: "8",
    name: "Women Floral Print Midi Dress",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline.",
    price: 2400,
    image: ["/src/assets/p_img8.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: new Date(1716634345455),
    bestseller: true,
    stock: 85
  },
  {
    _id: "9",
    name: "Little Girls Polka Dot Frock",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline.",
    price: 1100,
    image: ["/src/assets/p_img9.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M"],
    date: new Date(1716634345456),
    bestseller: false,
    stock: 100
  },
  {
    _id: "10",
    name: "Men Sports Joggers",
    description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline.",
    price: 1600,
    image: ["/src/assets/p_img10.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL", "XXL"],
    date: new Date(1716634345457),
    bestseller: true,
    stock: 110
  },
  {
    _id: "11",
    name: "Women Stylish Red Knitted Top",
    description: "A comfortable and stylish red knitted top for casual wear.",
    price: 1400,
    image: ["/src/assets/p_img11.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: new Date(1716634345458),
    bestseller: false,
    stock: 75
  },
  {
    _id: "12",
    name: "Men Olive Green Polo Shirt",
    description: "Classic olive green polo shirt with comfortable fit.",
    price: 1800,
    image: ["/src/assets/p_img12.png"],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: new Date(1716634345459),
    bestseller: false,
    stock: 65
  },
  {
    _id: "13",
    name: "Kids Cute Denim Jacket",
    description: "Trendy denim jacket for kids featuring a cool design.",
    price: 1600,
    image: ["/src/assets/p_img13.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    date: new Date(1716634345460),
    bestseller: true,
    stock: 55
  },
  {
    _id: "14",
    name: "Women Classic Blue Jeans",
    description: "Timeless classic blue jeans for everyday style.",
    price: 2200,
    image: ["/src/assets/p_img14.png"],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: new Date(1716634345461),
    bestseller: false,
    stock: 95
  },
  {
    _id: "15",
    name: "Men Formal Grey Trousers",
    description: "Elegant formal grey trousers perfect for office wear.",
    price: 2500,
    image: ["/src/assets/p_img15.png"],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L", "XL"],
    date: new Date(1716634345462),
    bestseller: false,
    stock: 80
  },
  {
    _id: "16",
    name: "Kids Bright Yellow Raincoat",
    description: "Vibrant yellow raincoat for kids, keeping them dry and stylish.",
    price: 1300,
    image: ["/src/assets/p_img16.png"],
    category: "Kids",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    date: new Date(1716634345463),
    bestseller: false,
    stock: 70
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✓ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    // Insert all 16 products
    const insertedProducts = await Product.insertMany(products);
    console.log(`✓ Inserted ${insertedProducts.length} products`);

    console.log('✓ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
