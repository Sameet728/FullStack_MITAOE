/**
 * MIT ACADEMY OF ENGINEERING (MITAOE), PUNE
 * DEPARTMENT OF DATA SCIENCE
 * Course: Full Stack Web Development - Laboratory Assignment 5
 * Student Developer: Sameet Pisal | PRN: 202401120018
 * 
 * Order CRUD API Routes (Node.js + Express + MongoDB / Mongoose)
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');

// In-memory fallback store for offline resilience if MongoDB Atlas connection is pending
let inMemoryOrders = [
  {
    _id: '670011a0e10a2b3c4d5e6f71',
    orderId: 'AUR-892144',
    customer: {
      name: 'Sameet Pisal',
      email: 'sameet.pisal@mitaoe.ac.in',
      phone: '+91 98765 43210',
      address: 'Department of Data Science, MITAOE Campus, Alandi Road',
      city: 'Pune',
      pincode: '412105'
    },
    items: [
      {
        watchId: 1,
        name: 'AUREUM Chronograde I',
        collectionName: 'Heritage',
        price: 485000,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&q=90&auto=format&fit=crop'
      }
    ],
    totalAmount: 485000,
    currency: 'INR',
    status: 'Confirmed',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    notes: 'Hand deliver with velvet gift presentation box',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: '670011a0e10a2b3c4d5e6f72',
    orderId: 'AUR-471209',
    customer: {
      name: 'Dr. Rajesh Deshmukh',
      email: 'rajesh.deshmukh@gmail.com',
      phone: '+91 98220 11223',
      address: 'Flat 402, Royal Palms, Koregaon Park',
      city: 'Pune',
      pincode: '411001'
    },
    items: [
      {
        watchId: 3,
        name: 'AUREUM Skeleton III',
        collectionName: 'Artisan',
        price: 1250000,
        quantity: 1,
        img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&q=90&auto=format&fit=crop'
      }
    ],
    totalAmount: 1250000,
    currency: 'INR',
    status: 'Processing',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    notes: 'Insured White Glove Courier',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// ============================================================================
// 1. CREATE: POST /api/orders
// Place a new timepiece purchase order in MongoDB
// ============================================================================
router.post('/', async (req, res) => {
  try {
    const { customer, items, paymentMethod, notes } = req.body;

    if (!customer || !customer.name || !customer.email || !customer.address) {
      return res.status(400).json({
        success: false,
        error: 'Missing required customer details (name, email, shipping address)'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'An order must contain at least one timepiece item'
      });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) * (Number(item.quantity) || 1)), 0);
    const orderId = 'AUR-' + Math.floor(100000 + Math.random() * 900000);

    const orderPayload = {
      orderId,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone ? customer.phone.trim() : '+91 90000 00000',
        address: customer.address.trim(),
        city: customer.city ? customer.city.trim() : 'Pune',
        pincode: customer.pincode ? customer.pincode.trim() : '412105'
      },
      items: items.map(it => ({
        watchId: it.watchId || it.id || 1,
        name: it.name,
        collectionName: it.collection || it.collectionName || 'Heritage',
        price: Number(it.price),
        quantity: Number(it.quantity) || 1,
        img: it.img || ''
      })),
      totalAmount,
      currency: 'INR',
      status: 'Confirmed',
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: 'Paid',
      notes: notes || 'AUREUM White Glove Delivery'
    };

    if (isDbConnected()) {
      const newOrder = await Order.create(orderPayload);
      return res.status(201).json({
        success: true,
        message: 'Watch purchase order created successfully in MongoDB',
        data: newOrder,
        databaseSource: 'MongoDB Atlas'
      });
    } else {
      const mockOrder = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...orderPayload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryOrders.unshift(mockOrder);
      return res.status(201).json({
        success: true,
        message: 'Watch purchase order created successfully',
        data: mockOrder,
        databaseSource: 'In-Memory / Pending Atlas Sync'
      });
    }
  } catch (error) {
    console.error('[API Error: POST /api/orders]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order: ' + error.message
    });
  }
});

// ============================================================================
// 2. READ: GET /api/orders
// Retrieve all orders with optional search and status filtering
// ============================================================================
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (status && status !== 'All') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { orderId: { $regex: search, $options: 'i' } },
          { 'customer.name': { $regex: search, $options: 'i' } },
          { 'customer.email': { $regex: search, $options: 'i' } },
          { 'items.name': { $regex: search, $options: 'i' } }
        ];
      }
      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
        databaseSource: 'MongoDB Atlas'
      });
    } else {
      let results = [...inMemoryOrders];
      if (status && status !== 'All') {
        results = results.filter(o => o.status.toLowerCase() === status.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        results = results.filter(o =>
          o.orderId.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q) ||
          o.items.some(it => it.name.toLowerCase().includes(q))
        );
      }
      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
        databaseSource: 'In-Memory / Pending Atlas Sync'
      });
    }
  } catch (error) {
    console.error('[API Error: GET /api/orders]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders: ' + error.message
    });
  }
});

// ============================================================================
// 3. READ: GET /api/orders/:id
// Retrieve a single order by MongoDB _id or orderId
// ============================================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let order = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        order = await Order.findById(id);
      }
      if (!order) {
        order = await Order.findOne({ orderId: id });
      }

      if (!order) {
        return res.status(404).json({
          success: false,
          error: `Order with ID '${id}' was not found in database`
        });
      }

      return res.status(200).json({
        success: true,
        data: order,
        databaseSource: 'MongoDB Atlas'
      });
    } else {
      const order = inMemoryOrders.find(o => o._id === id || o.orderId === id);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: `Order with ID '${id}' was not found`
        });
      }
      return res.status(200).json({
        success: true,
        data: order,
        databaseSource: 'In-Memory / Pending Atlas Sync'
      });
    }
  } catch (error) {
    console.error('[API Error: GET /api/orders/:id]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order: ' + error.message
    });
  }
});

// ============================================================================
// 4. UPDATE: PUT /api/orders/:id
// Update order details (shipping address, customer phone, notes, status)
// ============================================================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer, status, notes, paymentStatus } = req.body;

    const updates = {};
    if (customer) {
      if (customer.name) updates['customer.name'] = customer.name.trim();
      if (customer.email) updates['customer.email'] = customer.email.trim();
      if (customer.phone) updates['customer.phone'] = customer.phone.trim();
      if (customer.address) updates['customer.address'] = customer.address.trim();
      if (customer.city) updates['customer.city'] = customer.city.trim();
      if (customer.pincode) updates['customer.pincode'] = customer.pincode.trim();
    }
    if (status) updates.status = status;
    if (notes) updates.notes = notes;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    if (isDbConnected()) {
      let updatedOrder = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        updatedOrder = await Order.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
      }
      if (!updatedOrder) {
        updatedOrder = await Order.findOneAndUpdate({ orderId: id }, { $set: updates }, { new: true, runValidators: true });
      }

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          error: `Order with ID '${id}' was not found to update`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Order updated successfully in MongoDB',
        data: updatedOrder,
        databaseSource: 'MongoDB Atlas'
      });
    } else {
      const idx = inMemoryOrders.findIndex(o => o._id === id || o.orderId === id);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          error: `Order with ID '${id}' was not found`
        });
      }
      
      const existing = inMemoryOrders[idx];
      if (customer) existing.customer = { ...existing.customer, ...customer };
      if (status) existing.status = status;
      if (notes) existing.notes = notes;
      if (paymentStatus) existing.paymentStatus = paymentStatus;
      existing.updatedAt = new Date().toISOString();

      return res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: existing,
        databaseSource: 'In-Memory / Pending Atlas Sync'
      });
    }
  } catch (error) {
    console.error('[API Error: PUT /api/orders/:id]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order: ' + error.message
    });
  }
});

// ============================================================================
// 5. DELETE: DELETE /api/orders/:id
// Cancel / delete order from MongoDB
// ============================================================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let deletedOrder = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        deletedOrder = await Order.findByIdAndDelete(id);
      }
      if (!deletedOrder) {
        deletedOrder = await Order.findOneAndDelete({ orderId: id });
      }

      if (!deletedOrder) {
        return res.status(404).json({
          success: false,
          error: `Order with ID '${id}' was not found to delete`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Order ${deletedOrder.orderId} deleted successfully from MongoDB`,
        deletedId: deletedOrder._id,
        orderId: deletedOrder.orderId,
        databaseSource: 'MongoDB Atlas'
      });
    } else {
      const idx = inMemoryOrders.findIndex(o => o._id === id || o.orderId === id);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          error: `Order with ID '${id}' was not found`
        });
      }
      const removed = inMemoryOrders.splice(idx, 1)[0];
      return res.status(200).json({
        success: true,
        message: `Order ${removed.orderId} deleted successfully`,
        deletedId: removed._id,
        orderId: removed.orderId,
        databaseSource: 'In-Memory / Pending Atlas Sync'
      });
    }
  } catch (error) {
    console.error('[API Error: DELETE /api/orders/:id]', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete order: ' + error.message
    });
  }
});

// ============================================================================
// 6. AGGREGATE STATS: GET /api/orders/stats/summary
// Revenue and order volume analytics
// ============================================================================
router.get('/stats/summary', async (req, res) => {
  try {
    let orders = [];
    if (isDbConnected()) {
      orders = await Order.find();
    } else {
      orders = inMemoryOrders;
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0);
    const confirmedCount = orders.filter(o => o.status === 'Confirmed').length;
    const processingCount = orders.filter(o => o.status === 'Processing').length;
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
    const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        confirmedCount,
        processingCount,
        deliveredCount,
        cancelledCount
      },
      currency: 'INR'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
