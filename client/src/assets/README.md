# Assets Folder

This folder contains all image and static assets used in the application.

## 📁 Contents

### Logo & Navigation
- `logo.png` - Brand logo
- `logo.svg` - SVG version of logo

### Page Images
- `hero.png` - Hero section background image
- `about_img.png` - About page image
- `contact_img.png` - Contact page image

### Product Images
All product images follow naming pattern: `p_img{number}{_variant}.png`

#### Main Product Images
- `p_img1.png` through `p_img16.png` - Main product thumbnail images

#### Product Detail Images (Variants)
- `p_img1_1.png`, `p_img1_2.png`, `p_img1_3.png`, `p_img1_4.png` - Product 1 variants
- `p_img2_1.png` through `p_img2_4.png` - Product 2 variants
- `p_img3_1.png` through `p_img3_4.png` - Product 3 variants
- `p_img4_1.png` through `p_img4_4.png` - Product 4 variants

## 🔗 Usage

### In React Components
```javascript
import { assets } from '../assets';

// Using imported assets
<img src={assets.logo} alt="Logo" />
<img src={assets.heroImg} alt="Hero" />
```

### In assets.js
All image imports are centralized in `../assets.js`:
```javascript
import logo from './assets/logo.png'
import heroImg from './assets/hero.png'
import p_img1_1 from './assets/p_img1_1.png'
// ... more imports

export const products = [
  {
    image: [p_img1_1, p_img1_2, p_img1_3, p_img1_4],
    // ... product data
  }
]
```

## 📊 Image Specifications

### Recommended Sizes
- **Logo**: 200x200px (png), 200x200px (svg)
- **Hero Image**: 1920x600px (or larger)
- **Product Thumbnails**: 300x300px
- **Product Details**: 600x600px or larger
- **Page Images**: 800x600px minimum

### File Format
- **Products**: PNG format (transparency support)
- **Logo**: Both PNG and SVG provided
- **Pages**: PNG format

## 🔄 Adding New Images

1. Place image in this folder (`src/assets/`)
2. Import in `src/assets.js`
3. Export from the assets module
4. Use in components via the assets import

### Example:
```javascript
// In assets.js
import newImage from './assets/new_image.png'

export const assets = {
  // ... other assets
  newImage: newImage,
}

// In component
import { assets } from '../assets'
<img src={assets.newImage} alt="Description" />
```

## ⚠️ Best Practices

1. **Keep images optimized** - Compress before adding
2. **Use consistent naming** - Follow existing pattern
3. **Organize by type** - Group similar images
4. **Update assets.js** - Always export new images
5. **Use descriptive names** - Make purpose clear

## 🚀 Performance Tips

- Images are bundled during build
- Vite automatically optimizes during build
- Consider lazy loading for product images
- Use responsive images for different screen sizes

## 📝 Total Images
- **37 image files** total
- **4 product variant images** per product (16 products)
- **2 logo versions** (png + svg)
- **3 page-specific images** (hero, about, contact)

---

For more information, see [assets.js](../assets.js)
