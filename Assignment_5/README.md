# Laboratory Assignment 5: API Integration
## Four CRUD APIs using Node.JS, ExpressJS and MongoDB Atlas

**Institution:** MIT Academy of Engineering (MITAOE), Pune  
*(An Autonomous Institute Affiliated to Savitribai Phule Pune University)*  
**Department:** Department of Data Science  
**Course:** Full Stack Web Development  
**Student Name:** Sameet Pisal  
**PRN:** 202401120018  
**Academic Year:** 2026–2027  

---

## 1. Assignment Objective & Problem Statement
> **Assignment Question Statement:**  
> *"Create four API using Node.JS, ExpressJS and MongoDB for CURD"*

### Project Overview
This laboratory assignment implements a complete suite of four RESTful CRUD (Create, Read, Update, Delete) APIs integrated with a live **MongoDB Atlas multi-node cloud replica set cluster** (`cluster0.jfno2.mongodb.net`, database: `aureum_watch_db`).

The APIs power the e-commerce and order fulfillment lifecycle of the **AUREUM Luxury Timepieces** web application:
1. **CREATE (POST `/api/orders`)**: Client cart checkout and order placement with instant persistence in MongoDB Atlas.
2. **READ (GET `/api/orders` & GET `/api/orders/:id`)**: Real-time querying of orders with regex search and status filtering (`All`, `Confirmed`, `Processing`, `Delivered`, `Cancelled`).
3. **UPDATE (PUT `/api/orders/:id`)**: Atomic document updates for shipping address modification and lifecycle status transitions (`Confirmed` → `Processing` → `Delivered`).
4. **DELETE (DELETE `/api/orders/:id`)**: Secure order cancellation and document removal from MongoDB Atlas.
5. **OBSERVABILITY (GET `/api/status`)**: Diagnostic endpoint exposing live MongoDB connection state (`readyState: 1`), cluster host, database name, and memory heap metrics.

---

## 2. Requirements to Implementation Compliance Matrix

| Assignment Requirement | Technical Implementation Pattern |
| :--- | :--- |
| **MongoDB Atlas Cloud Database** | Configured production connection to MongoDB Atlas multi-node replica set cluster (`cluster0.jfno2.mongodb.net`) using Mongoose ODM with automated reconnection and indexing |
| **Mongoose Schema & Data Validation** | Engineered `Order` and `OrderItem` schemas enforcing strict data types, required customer fields, positive amount validation, status enums, and timestamps |
| **CREATE Operation (POST API)** | `POST /api/orders`: Parses order payloads, calculates investment totals, persists new documents to MongoDB Atlas collection, and returns HTTP 201 Created |
| **READ Operation (GET APIs)** | `GET /api/orders` & `GET /api/orders/:id`: Queries MongoDB Atlas with regex search, status filtering, and descending chronological sorting, returning HTTP 200 OK |
| **UPDATE Operation (PUT API)** | `PUT /api/orders/:id`: Performs atomic document mutation via `Order.findByIdAndUpdate`, supporting inline address modification and order lifecycle status progression |
| **DELETE Operation (DELETE API)** | `DELETE /api/orders/:id`: Executes atomic document deletion via `Order.findByIdAndDelete` with verification safeguards, returning HTTP 200 OK |
| **Client-Side E-Commerce UI Integration** | Full-stack integration in `index.html` featuring luxury Concierge Checkout modal (order creation) and real-time Orders Vault drawer with MongoDB status indicators |
| **Operational Health & Diagnostics** | `GET /api/status` endpoint delivering real-time MongoDB connection `readyState`, database name, cluster host, process memory heap, and route contracts |

---

## 3. Architecture & Data Flow

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. PRESENTATION LAYER: Single-Page Luxury Client Web Application       │
│    - AUREUM Shopping Cart -> Concierge Checkout Form                   │
│    - AUREUM Orders Vault Drawer (Search, Filters, Address Editor)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Fetch (JSON Payloads)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. APPLICATION & ROUTING LAYER: Node.js & Express HTTP Server (Port 5000)│
│    - Request Logging & Response Latency Tracking Middleware            │
│    - Institutional & Security Header Interceptor                       │
│    - JSON Body Parser & URL-Encoded Form Parser                        │
│    - REST Router: /api/orders                                          │
│        ├── POST   /api/orders     --> Create Order Controller          │
│        ├── GET    /api/orders     --> List & Filter Controller         │
│        ├── GET    /api/orders/:id --> Single Order Lookup Controller   │
│        ├── PUT    /api/orders/:id --> Update Order & Address Controller│
│        └── DELETE /api/orders/:id --> Cancel & Remove Controller       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Mongoose ODM Data Access Calls
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. DATA ACCESS LAYER: Mongoose ODM (Order.js & Watch.js Schemas)       │
│    - Data Type Validation (orderId, customer, items, totalAmount)      │
│    - Business Constraints (items.length > 0, status enums)             │
│    - Lifecycle Hooks (timestamps: createdAt, updatedAt)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ TLS / SSL Wire Protocol (mongodb+srv://)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. CLUSTER PERSISTENCE LAYER: MongoDB Atlas Cloud Database             │
│    - Sharded Replica Set: cluster0.jfno2.mongodb.net                   │
│    - Database: aureum_watch_db | Collection: orders                    │
│    - High-Availability Auto-Failover & Distributed Replication         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. API Specification & Endpoints

### 1. Create Order (POST)
- **Endpoint:** `POST /api/orders`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "customer": {
      "name": "Sameet Pisal",
      "email": "sameet.pisal@mitaoe.ac.in",
      "phone": "+91 98765 43210",
      "address": "Department of Data Science, MITAOE Campus, Alandi Road",
      "city": "Pune",
      "pincode": "412105"
    },
    "items": [
      {
        "watchId": 1,
        "name": "AUREUM Chronograde I",
        "collection": "Heritage",
        "price": 485000,
        "quantity": 1
      }
    ],
    "paymentMethod": "UPI",
    "notes": "Hand deliver with certificate of authenticity"
  }
  ```
- **Response:** `201 Created` with created document and MongoDB Atlas `_id`.

### 2. Read Orders (GET)
- **Endpoint:** `GET /api/orders`
- **Query Parameters:** `?status=Confirmed&search=Pisal`
- **Response:** `200 OK` with JSON array of orders.

### 3. Read Single Order (GET)
- **Endpoint:** `GET /api/orders/:id`
- **Parameter:** MongoDB `_id` or unique `orderId` (e.g., `AUR-892144`)
- **Response:** `200 OK` with order object.

### 4. Update Order (PUT)
- **Endpoint:** `PUT /api/orders/:id`
- **Request Body:**
  ```json
  {
    "status": "Processing",
    "customer": {
      "address": "Updated Suite 1204, Tower B, Pune"
    }
  }
  ```
- **Response:** `200 OK` with updated document.

### 5. Delete Order (DELETE)
- **Endpoint:** `DELETE /api/orders/:id`
- **Response:** `200 OK` with deleted order confirmation.

---

## 5. How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation & Execution
```bash
# Navigate to Assignment 5 folder
cd Assignment_5

# Install dependencies
npm install

# Start the server (configured with MongoDB Atlas connection in .env)
node server.js
```

### Accessing Endpoints
- **Interactive Web App with Orders Vault:** [http://localhost:5000/](http://localhost:5000/)
- **Orders Vault Modal:** [http://localhost:5000/?focus=orders](http://localhost:5000/?focus=orders)
- **Concierge Checkout Modal:** [http://localhost:5000/?focus=checkout](http://localhost:5000/?focus=checkout)
- **Server Health & MongoDB Status API:** [http://localhost:5000/api/status](http://localhost:5000/api/status)
- **Orders CRUD Endpoint:** [http://localhost:5000/api/orders](http://localhost:5000/api/orders)

---

## 6. Submission Artifacts
- **Formal Word Report:** `Assignment_5_Report_Sameet_Pisal_202401120018.docx`
- **Compiled PDF Report:** `Assignment_5_Report_Sameet_Pisal_202401120018.pdf`
- **Source Code:** `server.js`, `config/db.js`, `models/Order.js`, `routes/orderRoutes.js`, `public/index.html`
- **Verification Screenshots:** In `Assignment_5/screenshots/` (Figures 1 through 6)
