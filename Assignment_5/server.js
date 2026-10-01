/**
 * MIT ACADEMY OF ENGINEERING (MITAOE), PUNE
 * DEPARTMENT OF DATA SCIENCE
 * Course: Full Stack Web Development
 * Laboratory Assignment 5: API Integration
 * 
 * Objective: Create four APIs using Node.JS, ExpressJS and MongoDB for CRUD
 * Student Name: Sameet Pisal
 * PRN: 202401120018
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');
const watchRoutes = require('./routes/watchRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Connect to MongoDB Database
connectDB();

// ============================================================================
// 1. Core Parsers & Security Middleware
// ============================================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers for API accessibility
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Institutional Metadata & Attribution Headers
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Node.js / Express / MongoDB (MITAOE Data Science)');
  res.setHeader('X-Developer', 'Sameet Pisal (PRN: 202401120018)');
  res.setHeader('X-Course', 'Full Stack Web Development - Assignment 5');
  res.setHeader('X-Department', 'Department of Data Science');
  next();
});

// Request Logging & Latency Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toLocaleTimeString();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const color = statusCode >= 400 ? '\x1b[31m' : statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} -> ${color}${statusCode}\x1b[0m (${duration}ms)`);
  });

  next();
});

// ============================================================================
// 2. Static Web Application Serving
// ============================================================================
app.use(express.static(PUBLIC_DIR, {
  maxAge: '1h',
  etag: true,
  index: 'index.html'
}));
app.use(express.static(__dirname));

// ============================================================================
// 3. API Routes (Four CRUD Operations + Diagnostics)
// ============================================================================
app.use('/api/orders', orderRoutes);
app.use('/api/watches', watchRoutes);

// Server Diagnostic & MongoDB Status API
app.get('/api/status', (req, res) => {
  const mem = process.memoryUsage();
  const dbStateMap = {
    0: 'Disconnected',
    1: 'Connected (MongoDB Atlas)',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.status(200).json({
    status: 'online',
    serverType: 'Node.js + Express + MongoDB CRUD Application Server',
    assignment: 'Assignment 5: API Integration (MongoDB CRUD Operations)',
    student: {
      name: 'Sameet Pisal',
      prn: '202401120018',
      department: 'Department of Data Science',
      institution: 'MIT Academy of Engineering (MITAOE), Pune'
    },
    database: {
      status: dbStateMap[mongoose.connection.readyState] || 'Unknown',
      readyState: mongoose.connection.readyState,
      dbName: mongoose.connection.name || 'aureum_watch_db',
      host: mongoose.connection.host || 'cluster-atlas'
    },
    endpoints: {
      createOrder: 'POST /api/orders (C - Create Order)',
      readOrders: 'GET /api/orders (R - Read All Orders)',
      readOrderById: 'GET /api/orders/:id (R - Read Single Order)',
      updateOrder: 'PUT /api/orders/:id (U - Update Order & Address)',
      deleteOrder: 'DELETE /api/orders/:id (D - Delete / Cancel Order)',
      orderStats: 'GET /api/orders/stats/summary (Aggregate Analytics)'
    },
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptimeSeconds: Math.floor(process.uptime()),
      heapUsedMB: Math.round((mem.heapUsed / 1024 / 1024) * 100) / 100
    },
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// 4. Custom 404 Error Handler
// ============================================================================
app.use((req, res) => {
  const custom404 = path.join(PUBLIC_DIR, '404.html');
  if (fs.existsSync(custom404)) {
    res.status(404).sendFile(custom404);
  } else {
    res.status(404).json({ error: '404 Not Found - Route does not exist' });
  }
});

// Start Server
const server = app.listen(PORT, () => {
  console.log('\n=======================================================================');
  console.log('  MIT ACADEMY OF ENGINEERING (MITAOE), PUNE');
  console.log('  DEPARTMENT OF DATA SCIENCE');
  console.log('  Course: Full Stack Web Development');
  console.log('  LABORATORY ASSIGNMENT 5: Node.js + Express + MongoDB API Integration');
  console.log('-----------------------------------------------------------------------');
  console.log(`  Student Developer : Sameet Pisal`);
  console.log(`  Student PRN       : 202401120018`);
  console.log(`  Runtime           : Node.js ${process.version} on ${process.platform} (${process.arch})`);
  console.log(`  Database Engine   : MongoDB / Mongoose ODM`);
  console.log(`  Server Listening  : http://localhost:${PORT}`);
  console.log('-----------------------------------------------------------------------');
  console.log(`  CRUD API Endpoints:`);
  console.log(`  - [POST]   http://localhost:${PORT}/api/orders        (CREATE Order)`);
  console.log(`  - [GET]    http://localhost:${PORT}/api/orders        (READ Orders)`);
  console.log(`  - [GET]    http://localhost:${PORT}/api/orders/:id    (READ Single Order)`);
  console.log(`  - [PUT]    http://localhost:${PORT}/api/orders/:id    (UPDATE Order)`);
  console.log(`  - [DELETE] http://localhost:${PORT}/api/orders/:id    (DELETE Order)`);
  console.log(`  - [GET]    http://localhost:${PORT}/api/status        (SERVER Health API)`);
  console.log('=======================================================================\n');
});

module.exports = app;
