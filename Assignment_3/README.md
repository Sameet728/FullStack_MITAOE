# Assignment 3: Student Management System (React JS)

**Student Name:** Sameet Pisal  
**PRN:** 202401120018  
**Institution:** MIT Academy of Engineering (MITAOE), Pune  
**Department:** Department of Data Science  
**Course:** Full Stack Web Development  

---

## 📌 Problem Statement & Objective
> **Assignment Question:**  
> "Develop a Student Management System using React JS that allows users to add, view, update, and delete student records. The application should demonstrate the use of React components, props, state management, event handling, forms, and CRUD operations."

The application provides a modern, institutional administrative dashboard for student registration, branch filtering, analytics, record modification, and deletion confirmation.

---

## 🚀 Key Features & Architectural Patterns

1. **Modular React Components**:
   - `Header.jsx`: Institution branding, student profile chip (Sameet Pisal, PRN 202401120018), and quick action trigger.
   - `StudentStats.jsx`: Real-time KPI statistics cards (Total Enrolled, Active Departments, Average CGPA, Active Student count).
   - `StudentForm.jsx`: Controlled form component handling both **Enrollment** and **Inline Record Updates** with real-time validation (required fields, email regex, CGPA range `0.0 - 10.0`).
   - `StudentFilterBar.jsx`: Multi-field search (Name, PRN, Roll No, Department), Branch dropdown filter, Status filter, Sorting (A-Z, Roll No, CGPA), View mode toggle, and CSV export.
   - `StudentTable.jsx`: Tabular directory with colored student initials avatars, department tags, CGPA badges, status pills, and Edit/Delete action buttons.
   - `StudentCard.jsx`: Alternative Grid Cards view mode with dynamic performance progress bars.
   - `DeleteConfirmModal.jsx`: Modal confirmation dialog with backdrop to prevent accidental record removal.

2. **State & Persistence**:
   - `useState` hooks for responsive state management.
   - `useEffect` hook for persistent synchronization with browser `localStorage`.
   - `useRef` hook for smooth auto-scrolling to form on record edit.

3. **Complete CRUD Operations**:
   - **Create**: Add new student with duplicate PRN detection and instant toast notification.
   - **Read**: Live search across 5 fields, department filter, and dual view modes (Table vs. Cards).
   - **Update**: Pre-populates form with target student details, allows in-place edits and updates state.
   - **Delete**: Triggered via modal confirmation dialog, removing record from memory and `localStorage`.

4. **Data Export**:
   - Instant client-side CSV export of currently filtered student records.

---

## 💻 How to Run Locally

Navigate to the project directory and start the development server:

```bash
cd student-management
npm install
npm start
```

The application will be accessible at `http://localhost:3000`.

To build for production:

```bash
npm run build
```

---

## 📄 Submission Documents
- `Assignment_3_Report_Sameet_Pisal_202401120018.docx`: Formal academic submission report adhering to institutional guidelines with embedded high-resolution screenshots, compliance matrix, code listings, test cases, and conclusion.
