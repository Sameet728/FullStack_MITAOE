/**
 * MIT ACADEMY OF ENGINEERING (MITAOE), PUNE
 * DEPARTMENT OF DATA SCIENCE
 * Course: Full Stack Web Development - Laboratory Assignment 5
 * Student Developer: Sameet Pisal | PRN: 202401120018
 * 
 * Watch Catalog API Routes (Node.js + Express + MongoDB)
 */

const express = require('express');
const router = express.Router();
const Watch = require('../models/Watch');

const seedWatches = [
  {
    watchId: 1,
    name: 'AUREUM Chronograde I',
    collectionName: 'Heritage',
    tagline: 'The Original Masterpiece',
    price: 485000,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&q=90&auto=format&fit=crop',
    specs: { movement: 'Automatic', diameter: '42MM', water: '200M', reserve: '72H' },
    inStock: true
  },
  {
    watchId: 2,
    name: 'AUREUM Perpetual II',
    collectionName: 'Complication',
    tagline: 'Time Without Limits',
    price: 785000,
    img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&q=90&auto=format&fit=crop',
    specs: { movement: 'Perpetual Calendar', diameter: '40MM', water: '100M', reserve: '96H' },
    inStock: true
  },
  {
    watchId: 3,
    name: 'AUREUM Skeleton III',
    collectionName: 'Artisan',
    tagline: 'Transparency Perfected',
    price: 1250000,
    img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&q=90&auto=format&fit=crop',
    specs: { movement: 'Manual Wind', diameter: '41MM', water: '50M', reserve: '80H' },
    inStock: true
  },
  {
    watchId: 4,
    name: 'AUREUM Tourbillon IV',
    collectionName: 'Grand Complication',
    tagline: 'Against Gravity',
    price: 1850000,
    img: 'https://images.unsplash.com/photo-1548171915-b7f57bfc32bc?w=600&h=600&q=90&auto=format&fit=crop',
    specs: { movement: 'Flying Tourbillon', diameter: '43MM', water: '30M', reserve: '120H' },
    inStock: true
  },
  {
    watchId: 5,
    name: 'AUREUM Diver V',
    collectionName: 'Sport',
    tagline: 'Depth Without Compromise',
    price: 625000,
    img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&q=90&auto=format&fit=crop&crop=entropy',
    specs: { movement: 'Automatic', diameter: '44MM', water: '300M', reserve: '72H' },
    inStock: true
  },
  {
    watchId: 6,
    name: 'AUREUM GMT VI',
    collectionName: 'Travel',
    tagline: 'Two Cities, One Wrist',
    price: 920000,
    img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&q=90&auto=format&fit=crop&crop=entropy',
    specs: { movement: 'GMT Automatic', diameter: '41MM', water: '100M', reserve: '70H' },
    inStock: true
  }
];

// GET /api/watches
router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: seedWatches.length,
      data: seedWatches
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/watches/:id
router.get('/:id', async (req, res) => {
  try {
    const watch = seedWatches.find(w => w.watchId === parseInt(req.params.id));
    if (!watch) {
      return res.status(404).json({ success: false, error: 'Watch not found' });
    }
    res.status(200).json({ success: true, data: watch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
