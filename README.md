# 🛍️ ShopEase - E-Commerce Website

A modern, responsive e-commerce web application built with React and Vite. ShopEase provides a seamless shopping experience with features like product browsing, cart management, order placement, and more.

![ShopEase](./public/logo.svg)

## 🌟 Features

- **Product Catalog**: Browse through a wide range of products across different categories (Men, Women, Kids)
- **Advanced Filtering**: Filter products by category, subcategory, and search functionality
- **Shopping Cart**: Add products to cart with size selection and quantity management
- **Persistent Cart**: Cart items are saved in localStorage and persist across browser sessions
- **Order Management**: Place orders with COD payment method and track order history
- **Responsive Design**: Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean and intuitive interface with smooth animations and transitions
- **Product Details**: Detailed product pages with multiple images and size selection
- **Related Products**: Product recommendations based on category
- **Newsletter Subscription**: Stay updated with latest offers and products
- **Contact Page**: Easy way for customers to reach out

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.0.5
- **Routing**: React Router DOM 7.1.3
- **State Management**: React Context API
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: React Icons 5.4.0
- **Notifications**: React Toastify 11.0.3
- **Linting**: ESLint 9.17.0

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gudapavansai/ShopeaseEcomerceWebiste.git
   cd Ecomerce-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🚀 Usage

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
Ecomerce-website/
├── public/              # Static assets
│   ├── logo.png
│   └── logo.svg
├── src/
│   ├── assets/         # Images and static files
│   ├── components/     # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── LatestCollection.jsx
│   │   ├── BestSeller.jsx
│   │   ├── OurPolicy.jsx
│   │   ├── SearchBar.jsx
│   │   └── ...
│   ├── Pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Collection.jsx
│   │   ├── Product.jsx
│   │   ├── Cart.jsx
│   │   ├── PlaceOrder.jsx
│   │   ├── Orders.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Login.jsx
│   ├── context/        # Context API
│   │   └── ShopContext.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Key Features Explained

### Cart Persistence
The shopping cart uses localStorage to save items, ensuring your cart remains intact even after page refreshes or browser restarts.

### Responsive Navigation
Mobile-friendly navigation with a slide-out menu for smaller screens.

### Product Filtering
Advanced filtering system allowing users to filter by:
- Category (Men, Women, Kids)
- Subcategory (Topwear, Bottomwear, Winterwear)
- Search query

### Order Management
Complete order flow from cart to order placement with order history tracking.

## 🎨 Customization

### Modifying Products
Edit the product data in `src/assets.js` to add, remove, or modify products.

### Styling
The project uses Tailwind CSS. Customize the theme in `tailwind.config.js` or modify component styles directly in the JSX files.

### Currency
Change the currency symbol in `src/context/ShopContext.jsx` (currently set to ₹).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Gudapavansai**
- GitHub: [@Gudapavansai](https://github.com/Gudapavansai)
- Repository: [ShopeaseEcomerceWebiste](https://github.com/Gudapavansai/ShopeaseEcomerceWebiste)

## 🙏 Acknowledgments

- Product images and icons from various sources
- Inspiration from modern e-commerce platforms
- React and Vite communities

---

Made with ❤️ by Gudapavansai
