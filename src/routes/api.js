const express = require('express');
const router = express.Router();
const sheets = require('../services/sheets');

// Cache layer: reload from Sheets every 60s max
let cache = {};
let cacheTime = {};
const CACHE_TTL = 60_000;

function isFresh(key) {
  return cache[key] && (Date.now() - (cacheTime[key] || 0)) < CACHE_TTL;
}
function invalidate(key) { delete cache[key]; delete cacheTime[key]; }

// GET /api/products
router.get('/products', async (req, res) => {
  try {
    if (!isFresh('products')) {
      cache.products = await sheets.getProducts();
      cacheTime.products = Date.now();
    }
    res.json(cache.products);
  } catch (err) {
    console.error('GET /api/products error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/new-arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    if (!isFresh('arrivals')) {
      cache.arrivals = await sheets.getNewArrivals();
      cacheTime.arrivals = Date.now();
    }
    res.json(cache.arrivals);
  } catch (err) {
    console.error('GET /api/new-arrivals error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/specials
router.get('/specials', async (req, res) => {
  try {
    if (!isFresh('specials')) {
      cache.specials = await sheets.getSpecials();
      cacheTime.specials = Date.now();
    }
    res.json(cache.specials);
  } catch (err) {
    console.error('GET /api/specials error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/services
router.get('/services', async (req, res) => {
  try {
    if (!isFresh('services')) {
      cache.services = await sheets.getServices();
      cacheTime.services = Date.now();
    }
    res.json(cache.services);
  } catch (err) {
    console.error('GET /api/services error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/household
router.get('/household', async (req, res) => {
  try {
    if (!isFresh('household')) {
      cache.household = await sheets.getHousehold();
      cacheTime.household = Date.now();
    }
    res.json(cache.household);
  } catch (err) {
    console.error('GET /api/household error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/settings
router.get('/settings', async (req, res) => {
  try {
    if (!isFresh('settings')) {
      cache.settings = await sheets.getSettings();
      cacheTime.settings = Date.now();
    }
    res.json(cache.settings);
  } catch (err) {
    console.error('GET /api/settings error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cache/clear — force reload from Sheets
router.post('/cache/clear', (req, res) => {
  cache = {};
  cacheTime = {};
  res.json({ ok: true, message: 'Cache cleared' });
});

module.exports = router;
