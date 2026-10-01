# Laboratory Assignment 4: Backend Technologies
## Node.JS Application Serving a Responsive Static Luxury Web Application

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
> *"Create a Node.JS Application which serves a static website"*

### Key Highlights
- **Node.js HTTP Application Server:** High-performance, non-blocking asynchronous event loop server leveraging Express.js.
- **Static Website Served:** *AUREUM — Precision, Redefined* (An ultra-premium, responsive luxury watch website with dynamic catalog, craftsmanship showcase, mechanical movement specifications, shopping cart, and client-side authentication).
- **MIME & Cache Control:** Configured with `maxAge: '1h'` and `etag: true` for optimized HTTP 200/304 caching.
- **Request Logging Middleware:** Real-time console logging capturing HTTP method, route, status code, and latency in milliseconds.
- **Security & Institutional Headers:** Custom HTTP response headers attributing the application to Sameet Pisal, PRN 202401120018, Department of Data Science, MITAOE.
- **Diagnostic REST APIs:**
  - `GET /api/status` — Returns real-time server health, memory usage, uptime, Node version, and student metadata.
  - `GET /api/watch-collection` — Returns JSON dataset of luxury timepieces.
- **Graceful Error Handling:** Custom branded `public/404.html` error handler for undefined routes.

---

## 2. Requirements to Implementation Compliance Matrix

| Assignment Requirement | Technical Implementation Pattern |
| :--- | :--- |
| **Node.js Runtime & Server Setup** | Node.js (v26.7.0) runtime with Express.js micro-framework binding to PORT 5000 with process signal handlers (`SIGINT`/`SIGTERM`) |
| **Static File Serving Middleware** | Built-in `express.static` middleware serving `index.html`, custom CSS styles, JavaScript logic, and assets from the `public/` directory |
| **HTTP Cache-Control & ETags** | Configured HTTP `max-age` (1 hour) and `ETag` headers for static resources to optimize network transfer and client-side caching |
| **Request Logging & Latency Tracking** | Custom high-precision middleware intercepting requests, recording timestamps, calculating execution latency in milliseconds, and color-coding status codes |
| **Institutional & Security Headers** | Custom response headers injected across all routes (`X-Powered-By`, `X-Developer: Sameet Pisal`, `X-PRN: 202401120018`, `X-Department: Data Science`) |
| **Diagnostic & REST API Endpoints** | `GET /api/status` returning rich JSON server runtime diagnostics (heap memory, uptime, OS platform) and `GET /api/watch-collection` returning timepiece catalog data |
| **Custom Branded 404 Error Handler** | Catch-all 404 middleware serving an elegant, brand-aligned `public/404.html` page with status code 404 and return-to-home navigation |
| **Production Directory Architecture** | Organized multi-tier directory structure separating public assets (`index.html`, `404.html`), server entry point (`server.js`), and dependencies (`package.json`) |

---

## 3. Server Architecture & Middleware Pipeline

```text
Incoming HTTP Request (GET / or GET /api/status or GET /assets/...)
  │
  ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Request Logging & Latency Middleware                                │
│    - Captures high-resolution start timestamp                          │
│    - Hooks response 'finish' event to calculate processing duration    │
│    - Formats log: [Timestamp] METHOD PATH -> STATUS (Duration ms)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. Institutional & Security Metadata Header Middleware                 │
│    - Sets X-Powered-By: Node.js / Express (MITAOE Data Science)       │
│    - Sets X-Developer: Sameet Pisal (PRN: 202401120018)                │
│    - Sets X-Department: Department of Data Science                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. express.static('public', { maxAge: '1h', etag: true })              │
│    - Inspects requested path against public/ directory                 │
│    - Matches index.html, stylesheets, client JavaScript, images        │
│    - Sets HTTP Content-Type header via automatic MIME lookup           │
│    - Returns static file with 200/304 HTTP response                    │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │ [File Found]                   │ [File Not Found]
                    ▼                                ▼
            Stream Static File              ┌────────────────────────────┐
             to HTTP Response               │ 4. REST API Routing        │
                                            │    - GET /api/status       │
                                            │    - GET /api/watch-...    │
                                            └─────────────┬──────────────┘
                                                          │ [No API Match]
                                                          ▼
                                            ┌────────────────────────────┐
                                            │ 5. Custom 404 Error Handler│
                                            │    - Responds HTTP 404     │
                                            │    - Serves 404.html       │
                                            └────────────────────────────┘
```

---

## 4. How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Execution
```bash
# Navigate to the assignment folder
cd Assignment_4

# Install dependencies (Express)
npm install

# Start the Node.js server
node server.js
# Or from root workspace:
node app.js
```

### Accessing Endpoints
- **Static Website:** [http://localhost:5000/](http://localhost:5000/)
- **Server Health REST API:** [http://localhost:5000/api/status](http://localhost:5000/api/status)
- **Timepiece Catalog REST API:** [http://localhost:5000/api/watch-collection](http://localhost:5000/api/watch-collection)
- **Custom 404 Error Page:** [http://localhost:5000/non-existent-route](http://localhost:5000/non-existent-route)

---

## 5. Submission Artifacts
- **Formal Word Report:** `Assignment_4_Report_Sameet_Pisal_202401120018.docx`
- **Source Code:** `server.js`, `public/index.html`, `public/404.html`, `package.json`
- **Screenshots:** Stored in `Assignment_4/screenshots/` (Figures 1 through 7)
