const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const Product = require('../models/Product');
const router = express.Router();

puppeteer.use(StealthPlugin());

/**
 * Helper to extract metadata using Headless Chrome (Puppeteer)
 */
const extractProductMetadata = async (url) => {
  let browser;
  try {
    console.log('[DEBUG] Launching stealth browser...');
    browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    console.log('[DEBUG] Navigating to:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Wait for common price elements to render (give SPAs 2 seconds to settle)
    await new Promise(r => setTimeout(r, 2000));

    console.log('[DEBUG] Page loaded, evaluating DOM...');
    const extracted = await page.evaluate(() => {
      // Title
      let name = document.querySelector('meta[property="og:title"]')?.content || document.title || 'Unknown Product';
      
      // Try to get a cleaner name from h1 if the meta title is generic SEO garbage
      const h1Text = document.querySelector('h1')?.innerText?.trim();
      if (h1Text && (name.includes('Online Shopping Site') || name === 'Unknown Product')) {
        name = h1Text;
      }

      // Strip trailing branding separated by | or -
      name = name.split('|')[0].split('-')[0].trim();

      // Strip common prefixes even with leading whitespace
      name = name.replace(/^\s*(Buy|Shop)\s+/i, '');

      // Strip common suffixes
      name = name.replace(/Price in India.*/i, '');
      name = name.replace(/at lowest prices.*/i, '');
      name = name.replace(/Online Shopping Site.*/i, '');
      name = name.replace(/Buy Online.*/i, '');

      name = name.trim() || 'Unknown Product';

      // Image
      let image = document.querySelector('meta[property="og:image"]')?.content || 
                  document.querySelector('#landingImage, #imgBlkFront')?.src || '';
      
      // 3. Try JSON-LD first for robust price extraction
      let jsonPrice = null;
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        try {
          const data = JSON.parse(script.innerText);
          // Recursively search for 'price' or 'offers'
          const findPrice = (obj) => {
            if (!obj || typeof obj !== 'object') return null;
            if (obj.price && !isNaN(obj.price)) return obj.price;
            if (obj.offers && obj.offers.price) return obj.offers.price;
            if (Array.isArray(obj)) {
              for (const item of obj) {
                const p = findPrice(item);
                if (p) return p;
              }
            }
            for (const key in obj) {
              const p = findPrice(obj[key]);
              if (p) return p;
            }
            return null;
          };
          const p = findPrice(data);
          if (p) {
            jsonPrice = p.toString();
            break;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      // 4. Fallback to DOM selectors if JSON-LD fails
      let rawPrice = jsonPrice ||
                     document.querySelector('meta[property="og:price:amount"]')?.content ||
                     document.querySelector('.a-price-whole')?.innerText || 
                     document.querySelector('.pdp-price')?.innerText || 
                     document.querySelector('._30jeq3')?.innerText || 
                     document.querySelector('.Nx9bqj')?.innerText || // Newer Flipkart class
                     Array.from(document.querySelectorAll('div, span')).find(el => el.innerText?.match(/^₹[\d,]+(\.\d+)?$/))?.innerText || // Generic fallback looking for exactly '₹...'
                     '0';
      
      let price = rawPrice.replace(/[^\d.,]/g, '');
      // Remove trailing dot or comma if any
      price = price.replace(/[.,]+$/, '');
      if (price && price !== '0') {
        price = '₹' + price;
      } else {
        price = '₹0';
      }

      return { name, image, price };
    });

    console.log('[DEBUG] Extracted Data:', extracted);

    // Determine platform
    let platform = 'Other';
    const urlLower = url.toLowerCase();
    if (urlLower.includes('amazon') || urlLower.includes('amzn.')) platform = 'Amazon';
    else if (urlLower.includes('flipkart')) platform = 'Flipkart';
    else if (urlLower.includes('myntra')) platform = 'Myntra';
    else if (urlLower.includes('ajio')) platform = 'Ajio';

    return {
      name: extracted.name,
      image: extracted.image || null,
      savedPrice: extracted.price,
      platform,
      url,
      category: 'Others',
    };
  } catch (error) {
    console.error('[ERROR] Puppeteer Extraction Error:', error.message);
    throw new Error('Failed to extract data via Puppeteer');
  } finally {
    if (browser) {
      await browser.close();
      console.log('[DEBUG] Browser closed.');
    }
  }
};

// Route: Extract metadata from URL
router.post('/extract', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const extractedData = await extractProductMetadata(url);
    res.json(extractedData);
  } catch (error) {
    res.status(500).json({ error: 'Extraction failed. The site might be blocking bots.' });
  }
});

// Route: Save a product
router.post('/products', async (req, res) => {
  const { name, image, platform, url, savedPrice, category, notes } = req.body;
  
  if (!url || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newProduct = await Product.create({
      name,
      image,
      platform,
      url,
      savedPrice,
      category,
      notes: notes || ''
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Failed to save product to database' });
  }
});

// Route: Get all active products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ isArchived: false }).sort({ createdAt: -1 });
    const formattedProducts = products.map(p => ({
      ...p._doc,
      id: p._id.toString()
    }));
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products from database' });
  }
});

// Route: Get archived products
router.get('/products/archived', async (req, res) => {
  try {
    const products = await Product.find({ isArchived: true }).sort({ createdAt: -1 });
    const formattedProducts = products.map(p => ({
      ...p._doc,
      id: p._id.toString()
    }));
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching archived products:', error);
    res.status(500).json({ error: 'Failed to fetch archived products' });
  }
});

// Route: Archive a product
router.put('/products/:id/archive', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isArchived: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Error archiving product:', error);
    res.status(500).json({ error: 'Failed to archive product' });
  }
});

// Route: Restore a product
router.put('/products/:id/restore', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isArchived: false });
    res.json({ success: true });
  } catch (error) {
    console.error('Error restoring product:', error);
    res.status(500).json({ error: 'Failed to restore product' });
  }
});

// Route: Permanently delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
