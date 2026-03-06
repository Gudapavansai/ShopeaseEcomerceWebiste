import express from 'express';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Admin: Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
    }

    const admin = new Admin({ name, email, password });
    await admin.save();

    const token = generateToken(admin._id);
    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(admin._id);
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Admin: Create product
router.post('/create', async (req, res) => {
  try {
    const { _id, name, description, price, category, subCategory, sizes, image, bestseller } = req.body;

    if (!_id || !name || !description || !price || !category || !subCategory) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ _id });
    if (existingProduct) {
      return res.status(400).json({ success: false, message: 'Product already exists' });
    }

    const product = new Product({
      _id,
      name,
      description,
      price,
      category,
      subCategory,
      sizes: sizes || [],
      image: image || [],
      bestseller: bestseller || false,
      stock: 100
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update product
router.put('/update/:id', async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, image, bestseller, stock } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { name, description, price, category, subCategory, sizes, image, bestseller, stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Delete product
router.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Get all products (with full details)
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
