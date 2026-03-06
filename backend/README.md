# E-Commerce Backend API

Backend server for the e-commerce website built with Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Installation
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secret_key_here
```

### 3. MongoDB Setup
Make sure MongoDB is installed and running:
```bash
# Start MongoDB (Windows)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your connection string
```

### 4. Running the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
  - Query params: `category`, `subCategory`, `sort` (low-high, high-low, newest)
- `GET /api/products/:id` - Get single product
- `GET /api/products/best-seller/products` - Get best seller products
- `GET /api/products/search/query?q=search` - Search products

### Authentication
- `POST /api/auth/signup` - User registration
  - Body: `{ name, email, password }`
- `POST /api/auth/login` - User login
  - Body: `{ email, password }`
- `GET /api/auth/profile/:userId` - Get user profile
- `PUT /api/auth/profile/:userId` - Update user profile

### Orders
- `POST /api/orders/place` - Create new order
  - Body: `{ userId, items, amount, address, paymentMethod }`
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:orderId` - Get single order
- `PUT /api/orders/:orderId/cancel` - Cancel order
- `PUT /api/orders/:orderId/status` - Update order status (Admin)

### Contact
- `POST /api/contact` - Submit contact message
  - Body: `{ name, email, subject, message }`
- `GET /api/contact` - Get all messages (Admin)
- `GET /api/contact/:id` - Get single message
- `PUT /api/contact/:id/reply` - Reply to message (Admin)

### Cart
- `POST /api/cart/calculate` - Calculate cart total
- `POST /api/cart/validate` - Validate cart items

## Database Models

### Product
```javascript
{
  _id: String,
  name: String,
  description: String,
  price: Number,
  category: String,
  subCategory: String,
  sizes: [String],
  image: [String],
  bestseller: Boolean,
  stock: Number,
  date: Date
}
```

### User
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  createdAt: Date
}
```

### Order
```javascript
{
  userId: String,
  items: [{
    _id: String,
    name: String,
    price: Number,
    size: String,
    quantity: Number
  }],
  amount: Number,
  address: Object,
  status: String, // 'Order Placed', 'Packing', 'Shipped', etc.
  paymentMethod: String, // 'COD', 'Credit Card', etc.
  paymentStatus: String,
  createdAt: Date
}
```

## Features

✅ Product management and filtering
✅ User authentication with JWT
✅ Order management
✅ Order status tracking
✅ Contact form handling
✅ Password hashing with bcryptjs
✅ CORS support for frontend integration
✅ Error handling middleware
✅ MongoDB database integration

## Next Steps

1. Add admin routes for product management
2. Implement payment gateway integration (Stripe, Razorpay)
3. Add email notifications
4. Implement inventory management
5. Add review and rating system
6. Add image upload functionality
7. Implement order tracking with real-time updates
