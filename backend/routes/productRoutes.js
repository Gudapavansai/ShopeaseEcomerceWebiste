import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, sort } = req.query;

    let query = {};
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;

    let products = await Product.find(query).sort({ date: -1 });

    // Sorting
    if (sort === 'low-high') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-low') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'oldest') {
      products.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get best seller products
router.get('/best-seller/products', async (req, res) => {
  try {
    const products = await Product.find({ bestseller: true }).limit(10);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Search products
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(200).json({ success: true, products: [] });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
