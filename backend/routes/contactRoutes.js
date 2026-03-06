import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Create contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const contactMessage = new Contact({
      name,
      email,
      subject,
      message,
      status: 'New'
    });
    
    await contactMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contact: contactMessage
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all contact messages (Admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      contacts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single contact message
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    res.status(200).json({
      success: true,
      contact
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reply to contact message (Admin)
router.put('/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    
    if (!reply) {
      return res.status(400).json({ success: false, message: 'Reply is required' });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        reply,
        status: 'Replied',
        repliedAt: Date.now()
      },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      contact
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
