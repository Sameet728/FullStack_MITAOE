/**
 * MIT ACADEMY OF ENGINEERING (MITAOE), PUNE
 * DEPARTMENT OF DATA SCIENCE
 * Course: Full Stack Web Development
 * Laboratory Assignment 4: Backend Technologies
 * 
 * Objective: Create a Node.JS Application which serves a static website
 * Student Name: Sameet Pisal
 * PRN: 202401120018
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// ============================================================================
// 1. Request Logging Middleware
// ============================================================================
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
// 2. Custom Security & Institutional Metadata Headers
// ============================================================================
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Node.js / Express (MITAOE Data Science)');
  res.setHeader('X-Developer', 'Sameet Pisal (PRN: 202401120018)');
  res.setHeader('X-Course', 'Full Stack Web Development - Assignment 4');
  res.setHeader('X-Department', 'Department of Data Science');
  next();
});

// ============================================================================
// 3. Static File Serving Middleware
// Serves static assets (HTML, CSS, JS, Images, Icons) with cache control
// ============================================================================
app.use(express.static(PUBLIC_DIR, {
  maxAge: '1h',
  etag: true,
  index: 'index.html'
}));

// Fallback static serving for root workspace files if present
app.use(express.static(__dirname));

// ============================================================================
// 4. Primary Web Application Routes
// ============================================================================

// Root Route: Serves the AUREUM Luxury Timepieces static website
app.get('/', (req, res) => {
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

// Backend Diagnostic & Health API Endpoint
app.get('/api/status', (req, res) => {
  const memory = process.memoryUsage();
  res.json({
    status: 'online',
    serverType: 'Node.js Static Web Application Server',
    assignment: 'Assignment 4: Backend Technologies (Node.js Static Web Server)',
    student: {
      name: 'Sameet Pisal',
      prn: '202401120018',
      department: 'Department of Data Science',
      institution: 'MIT Academy of Engineering (MITAOE), Pune'
    },
    staticConfig: {
      publicDirectory: PUBLIC_DIR,
      indexFile: 'index.html',
      cachingEnabled: true
    },
    runtime: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptimeSeconds: Math.floor(process.uptime()),
      heapUsedMB: +(memory.heapUsed / 1024 / 1024).toFixed(2),
      heapTotalMB: +(memory.heapTotal / 1024 / 1024).toFixed(2)
    },
    timestamp: new Date().toISOString()
  });
});

// Complementary Catalog API route
app.get('/api/watch-collection', (req, res) => {
  res.json({
    brand: 'AUREUM',
    motto: 'Precision, Redefined',
    collectionYear: 2026,
    watches: [
      { id: 'chronograde-1', name: 'Chronograde I', price: '$12,400', calibre: 'A-3135 Automatic', case: '42mm 316L Stainless Steel', powerReserve: '72 Hours' },
      { id: 'monolith-noir', name: 'Monolith Noir', price: '$16,800', calibre: 'A-3135 Carbon', case: '41mm DLC Matte Titanium', powerReserve: '72 Hours' },
      { id: 'regatta-gold', name: 'Sovereign Gold', price: '$24,500', calibre: 'A-4200 Grand Complication', case: '40mm 18k Rose Gold', powerReserve: '68 Hours' }
    ]
  });
});

// ============================================================================
// 5. 404 Custom Error Handler Middleware
// ============================================================================
app.use((req, res) => {
  const notFoundPath = path.join(PUBLIC_DIR, '404.html');
  res.status(404);
  if (fs.existsSync(notFoundPath)) {
    res.sendFile(notFoundPath);
  } else if (fs.existsSync(path.join(__dirname, '404.html'))) {
    res.sendFile(path.join(__dirname, '404.html'));
  } else {
    res.type('txt').send('404 Not Found — Resource does not exist on this Node.js server.');
  }
});

// ============================================================================
// 6. Global 500 Error Handler
// ============================================================================
app.use((err, req, res, next) => {
  console.error('\x1b[31m[ServerError]\x1b[0m', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    statusCode: 500
  });
});

// ============================================================================
// 7. Server Initialization & Terminal Banner
// ============================================================================
app.listen(PORT, () => {
  console.log('\n\x1b[1m\x1b[36m=======================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[33m  MIT ACADEMY OF ENGINEERING (MITAOE), PUNE\x1b[0m');
  console.log('\x1b[1m  DEPARTMENT OF DATA SCIENCE\x1b[0m');
  console.log('  Course: Full Stack Web Development');
  console.log('\x1b[32m  LABORATORY ASSIGNMENT 4: Node.JS Static Web Server\x1b[0m');
  console.log('-----------------------------------------------------------------------');
  console.log('  Student Developer : \x1b[1m\x1b[37mSameet Pisal\x1b[0m');
  console.log('  Student PRN       : \x1b[1m\x1b[37m202401120018\x1b[0m');
  console.log('  Runtime           : Node.js ' + process.version + ' on ' + process.platform);
  console.log('  Static Website    : AUREUM — Luxury Timepieces (index.html)');
  console.log('  Static Directory  : ' + PUBLIC_DIR);
  console.log('-----------------------------------------------------------------------');
  console.log('  Server URL        : \x1b[1m\x1b[34mhttp://localhost:' + PORT + '/\x1b[0m');
  console.log('  Server Health API : \x1b[1m\x1b[34mhttp://localhost:' + PORT + '/api/status\x1b[0m');
  console.log('  Watch Catalog API : \x1b[1m\x1b[34mhttp://localhost:' + PORT + '/api/watch-collection\x1b[0m');
  console.log('\x1b[1m\x1b[36m=======================================================================\x1b[0m\n');
});
