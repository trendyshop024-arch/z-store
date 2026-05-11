import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(process.cwd(), 'db.json');

// Initial Data
const DEFAULT_DATA = {
  settings: {
    showTrendingBanner: true,
    trendingBannerUrl: '',
    midBannerUrl: '',
    footerStickyUrl: '',
    promoBannerUrl: '',
  },
  shopInfo: {
    about: 'Welcome to Z Store. We provide the most premium and high quality products for all your needs.',
    phone: '+91 9876543210',
    email: 'contact@zstore.com',
    address: '123, Luxury Street, Mumbai, India',
    facebook: '#',
    instagram: '#',
    twitter: '#',
    whatsapp: '#',
    outlets: 'Visit our flagship store in Mumbai and Delhi.',
    googleMapsUrl: ''
  },
  banners: [
    { id: 1, url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&h=400&fit=crop', link: '#' },
    { id: 2, url: 'https://images.unsplash.com/photo-1441984969811-49202c652730?q=80&w=1200&h=400&fit=crop', link: '#' }
  ],
  categories: [
    { id: 1, name: 'Men', img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=150&h=150&fit=crop' },
    { id: 2, name: 'Women', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&h=150&fit=crop' },
    { id: 3, name: 'Kids', img: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=150&h=150&fit=crop' },
    { id: 4, name: 'Formals', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=150&h=150&fit=crop' }
  ],
  subCategories: [
    { id: 1, name: 'Tshirts', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=150&h=150&fit=crop' },
    { id: 2, name: 'Shirts', img: 'https://images.unsplash.com/photo-1596755094514-f87034a264c6?q=80&w=150&h=150&fit=crop' },
    { id: 3, name: 'Lowers', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=150&h=150&fit=crop' },
    { id: 4, name: 'Joggers', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=150&h=150&fit=crop' },
    { id: 5, name: 'Trousers', img: 'https://images.unsplash.com/photo-1624371414361-e6e8ea01f116?q=80&w=150&h=150&fit=crop' },
    { id: 6, name: 'Dresses', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=150&h=150&fit=crop' },
    { id: 7, name: 'Tops', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=150&h=150&fit=crop' }
  ],
  products: [
    { 
      id: 1, 
      name: 'Premium Cotton Slim Fit Shirt', 
      price: 499, 
      oldPrice: 1299, 
      discount: '61%', 
      img: 'https://images.unsplash.com/photo-1596755094514-f87034a264c6?q=80&w=500&h=700&fit=crop',
      categoryId: 1,
      subCategoryId: 2,
      trending: true
    },
    { 
      id: 2, 
      name: 'Floral Print Summer Dress', 
      price: 799, 
      oldPrice: 1999, 
      discount: '60%', 
      img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=500&h=700&fit=crop',
      categoryId: 2,
      subCategoryId: 6,
      trending: true
    },
    { 
      id: 3, 
      name: 'Oversized Anime Tee', 
      price: 349, 
      oldPrice: 899, 
      discount: '61%', 
      img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&h=700&fit=crop',
      categoryId: 1,
      subCategoryId: 1,
      trending: true
    },
    { 
      id: 4, 
      name: 'Classic Navy Blue Suit', 
      price: 2499, 
      oldPrice: 5999, 
      discount: '58%', 
      img: 'https://images.unsplash.com/photo-1594932224010-75b118b622ca?q=80&w=500&h=700&fit=crop',
      categoryId: 4,
      subCategoryId: 9,
      trending: false
    },
    { 
      id: 5, 
      name: 'Cotton Blend Kids Set', 
      price: 449, 
      oldPrice: 999, 
      discount: '55%', 
      img: 'https://images.unsplash.com/photo-1519233073524-7928d27ecf54?q=80&w=500&h=700&fit=crop',
      categoryId: 3,
      subCategoryId: 8,
      trending: false
    }
  ]
};

// Ensure DB exists and is valid
function ensureDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.log('Creating initial db.json...');
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
    } else {
      // Validate existing file
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      if (!content || content.trim() === '') {
        console.log('db.json is empty, resetting to default...');
        fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
      } else {
        JSON.parse(content); // Try parsing to check validity
      }
    }
  } catch (err) {
    console.error('Error validating db.json, resetting to default:', err);
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

ensureDB();

async function startServer() {
  const app = express();
  app.use(express.json());

  const getDB = () => {
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (err) {
      console.error('Failed to read database:', err);
      return DEFAULT_DATA;
    }
  };
  const saveDB = (data) => {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Failed to save database:', err);
    }
  };

  // API Routes
  app.get('/api/data', (req, res) => {
    try {
      const db = getDB();
      if (!db.settings) {
        db.settings = { showTrendingBanner: true };
        saveDB(db);
      }
      res.json(db);
    } catch (err) {
      res.status(500).json({ error: 'Failed to access database' });
    }
  });

  app.post('/api/products', (req, res) => {
    const db = getDB();
    const newProduct = { ...req.body, id: Date.now() };
    db.products.push(newProduct);
    saveDB(db);
    res.json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const db = getDB();
    const index = db.products.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
      db.products[index] = { ...req.body, id: parseInt(req.params.id) };
      saveDB(db);
      res.json(db.products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  app.delete('/api/products/:id', (req, res) => {
    const db = getDB();
    db.products = db.products.filter(p => p.id !== parseInt(req.params.id));
    saveDB(db);
    res.json({ success: true });
  });

  // Categories API
  app.post('/api/categories', (req, res) => {
    const db = getDB();
    const newCategory = { ...req.body, id: Date.now() };
    db.categories.push(newCategory);
    saveDB(db);
    res.json(newCategory);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const db = getDB();
    db.categories = db.categories.filter(c => c.id !== parseInt(req.params.id));
    saveDB(db);
    res.json({ success: true });
  });

  // Sub-Categories API
  app.post('/api/subcategories', (req, res) => {
    const db = getDB();
    const newSubCat = { ...req.body, id: Date.now() };
    db.subCategories.push(newSubCat);
    saveDB(db);
    res.json(newSubCat);
  });

  app.put('/api/subcategories/:id', (req, res) => {
    const db = getDB();
    const index = db.subCategories.findIndex(sc => sc.id === parseInt(req.params.id));
    if (index !== -1) {
      db.subCategories[index] = { ...req.body, id: parseInt(req.params.id) };
      saveDB(db);
      res.json(db.subCategories[index]);
    } else {
      res.status(404).json({ error: 'Sub-category not found' });
    }
  });

  app.delete('/api/subcategories/:id', (req, res) => {
    const db = getDB();
    db.subCategories = db.subCategories.filter(sc => sc.id !== parseInt(req.params.id));
    saveDB(db);
    res.json({ success: true });
  });

  // Banners API
  app.post('/api/banners', (req, res) => {
    const db = getDB();
    const newBanner = { ...req.body, id: Date.now() };
    db.banners.push(newBanner);
    saveDB(db);
    res.json(newBanner);
  });

  app.delete('/api/banners/:id', (req, res) => {
    const db = getDB();
    db.banners = db.banners.filter(b => b.id !== parseInt(req.params.id));
    saveDB(db);
    res.json({ success: true });
  });

  // Settings API
  app.put('/api/settings', (req, res) => {
    const db = getDB();
    db.settings = { ...db.settings, ...req.body };
    saveDB(db);
    res.json(db.settings);
  });

  // Shop Info API
  app.put('/api/shopinfo', (req, res) => {
    const db = getDB();
    db.shopInfo = { ...db.shopInfo, ...req.body };
    saveDB(db);
    res.json(db.shopInfo);
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on http://localhost:3000');
  });
}

startServer();
