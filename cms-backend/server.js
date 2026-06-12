/**
 * Standalone CMS Backend Server
 * Written in Vanilla Node.js (no dependencies required)
 * Run with: node cms-backend/server.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// Ensure data files exist
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify([], null, 2));
  }
}

initDB();

function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

// Enable CORS headers
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer(async (req, res) => {
  setCORS(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // ------------------ PRODUCTS ENDPOINTS ------------------
  if (pathname === '/api/products') {
    if (req.method === 'GET') {
      const products = readJSON(PRODUCTS_FILE);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(products));
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = await parseJSONBody(req);
        if (!body.name || !body.price || !body.category) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing name, price, or category' }));
          return;
        }

        const products = readJSON(PRODUCTS_FILE);
        const newProduct = {
          id: `prod-${Date.now()}`,
          name: body.name,
          price: parseFloat(body.price),
          description: body.description || '',
          category: body.category,
          image: body.image || '/images/default-drug.jpg',
          stock: parseInt(body.stock) || 100,
          rating: 5.0,
          reviewsCount: 0
        };

        products.push(newProduct);
        writeJSON(PRODUCTS_FILE, products);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newProduct));
        return;
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON request body' }));
        return;
      }
    }
  }

  // DELETE product by ID (e.g. DELETE /api/products?id=prod-123 or DELETE /api/products/prod-123)
  if (pathname.startsWith('/api/products/')) {
    const id = pathname.split('/').pop();
    if (req.method === 'DELETE') {
      const products = readJSON(PRODUCTS_FILE);
      const filtered = products.filter(p => p.id !== id);
      
      if (products.length === filtered.length) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found' }));
        return;
      }

      writeJSON(PRODUCTS_FILE, filtered);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Product ${id} deleted` }));
      return;
    }
  }

  // Fallback for query param delete: DELETE /api/products?id=prod-123
  if (pathname === '/api/products' && req.method === 'DELETE') {
    const id = parsedUrl.searchParams.get('id');
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing product ID' }));
      return;
    }

    const products = readJSON(PRODUCTS_FILE);
    const filtered = products.filter(p => p.id !== id);
    writeJSON(PRODUCTS_FILE, filtered);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // ------------------ CATEGORIES ENDPOINTS ------------------
  if (pathname === '/api/categories') {
    if (req.method === 'GET') {
      const categories = readJSON(CATEGORIES_FILE);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(categories));
      return;
    }

    if (req.method === 'POST') {
      try {
        const body = await parseJSONBody(req);
        if (!body.name) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Category name is required' }));
          return;
        }

        const categories = readJSON(CATEGORIES_FILE);
        const slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        
        if (categories.some(c => c.slug === slug)) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Category already exists' }));
          return;
        }

        const newCategory = {
          id: `cat-${Date.now()}`,
          name: body.name,
          slug
        };

        categories.push(newCategory);
        writeJSON(CATEGORIES_FILE, categories);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newCategory));
        return;
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
        return;
      }
    }

    if (req.method === 'DELETE') {
      const slug = parsedUrl.searchParams.get('slug');
      if (!slug) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Category slug is required' }));
        return;
      }

      const categories = readJSON(CATEGORIES_FILE);
      const filtered = categories.filter(c => c.slug !== slug);
      writeJSON(CATEGORIES_FILE, filtered);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      return;
    }
  }

  // 404 Route
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`CMS Backend Server is running at http://localhost:${PORT}`);
});
