/**
 * MIT ACADEMY OF ENGINEERING (MITAOE), PUNE
 * DEPARTMENT OF DATA SCIENCE
 * Course: Full Stack Web Development - Laboratory Assignment 5
 * Student Developer: Sameet Pisal | PRN: 202401120018
 * 
 * Mongoose Schema: Watch Purchase Order Model
 */

const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  watchId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  collectionName: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  img: {
    type: String
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
    default: () => 'AUR-' + Math.floor(100000 + Math.random() * 900000)
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Shipping address is required'],
      trim: true
    },
    city: {
      type: String,
      default: 'Pune'
    },
    pincode: {
      type: String,
      default: '412105'
    }
  },
  items: {
    type: [OrderItemSchema],
    validate: [val => val.length > 0, 'An order must contain at least one timepiece']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Confirmed'
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'NetBanking', 'UPI', 'Concierge Cash'],
    default: 'UPI'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Paid'
  },
  notes: {
    type: String,
    default: 'AUREUM White Glove Delivery'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
