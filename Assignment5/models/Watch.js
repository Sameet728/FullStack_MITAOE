/**
 * MIT ACADEMY OF ENGINEERING (MITAOE), PUNE
 * DEPARTMENT OF DATA SCIENCE
 * Course: Full Stack Web Development - Laboratory Assignment 5
 * Student Developer: Sameet Pisal | PRN: 202401120018
 * 
 * Mongoose Schema: Watch Catalog Model
 */

const mongoose = require('mongoose');

const WatchSchema = new mongoose.Schema({
  watchId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  collectionName: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  img: {
    type: String,
    required: true
  },
  specs: {
    movement: { type: String, default: 'Automatic' },
    diameter: { type: String, default: '42MM' },
    water: { type: String, default: '200M' },
    reserve: { type: String, default: '72H' }
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Watch', WatchSchema);
