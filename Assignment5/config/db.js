/**
 * MIT ACADEMY OF ENGINEERING (MITAOE), PUNE
 * DEPARTMENT OF DATA SCIENCE
 * Course: Full Stack Web Development - Laboratory Assignment 5
 * Student Developer: Sameet Pisal | PRN: 202401120018
 * 
 * Database Configuration & MongoDB Connection Manager
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sameetpisal:7pksj2XDBZwKPbtj@cluster0.jfno2.mongodb.net/aureum_watch_db?retryWrites=true&w=majority&appName=Cluster0';
  
  console.log('\n[MongoDB] Initiating connection to database...');
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });
    
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}`);
    console.log(`[MongoDB] Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn('[MongoDB] Note: Please configure MONGODB_URI in your .env file with your MongoDB Atlas connection string.');
    return null;
  }
};

module.exports = connectDB;
