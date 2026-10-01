import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import StudentStats from './components/StudentStats';
import StudentForm from './components/StudentForm';
import StudentFilterBar from './components/StudentFilterBar';
import StudentTable from './components/StudentTable';
import StudentCard from './components/StudentCard';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import './index.css';

const INITIAL_STUDENTS = [
  {
    id: 1,
    name: 'Sameet Pisal',
    rollNumber: '41',
    prn: '202401120018',
    department: 'Computer Engineering',
    semester: 'Semester 5',
    email: 'sameet.pisal@mitaoe.ac.in',
    cgpa: '9.45',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Aditi Sharma',
    rollNumber: '08',
    prn: '202401120004',
    department: 'Computer Engineering',
    semester: 'Semester 5',
    email: 'aditi.sharma@mitaoe.ac.in',
    cgpa: '9.12',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Rohan Patil',
    rollNumber: '56',
    prn: '202401120032',
    department: 'Data Science',
    semester: 'Semester 5',
    email: 'rohan.patil@mitaoe.ac.in',
    cgpa: '8.78',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Sneha Kulkarni',
    rollNumber: '14',
    prn: '202401120045',
    department: 'AI & Machine Learning',
    semester: 'Semester 5',
    email: 'sneha.k@mitaoe.ac.in',
    cgpa: '9.60',
    status: 'Active'
  },
  {
    id: 5,
    name: 'Vikram Deshmukh',
    rollNumber: '22',
    prn: '202301120019',
    department: 'Information Technology',
    semester: 'Semester 7',
    email: 'vikram.d@mitaoe.ac.in',
    cgpa: '7.90',
    status: 'On Leave'
  },
  {
    id: 6,
    name: 'Pooja Verma',
    rollNumber: '33',
    prn: '202101120012',
    department: 'Electronics & Telecommunication',
    semester: 'Semester 8',
    email: 'pooja.v@mitaoe.ac.in',
    cgpa: '8.40',
    status: 'Graduated'
  }
];

function App() {
  // 1. Persistence via LocalStorage
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('mitaoe_students_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading localStorage', e);
    }
    return INITIAL_STUDENTS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mitaoe_students_data', JSON.stringify(students));
    } catch (e) {
      console.error('Failed saving to localStorage', e);
    }
  }, [students]);

  // Parse initial state from URL query parameters if provided
  const queryParams = new URLSearchParams(window.location.search);
  const initialView = queryParams.get('view') === 'card' ? 'card' : 'table';
  const initialSearch = queryParams.get('search') || '';
  const initialDept = queryParams.get('dept') || 'All Departments';
  const editIdParam = queryParams.get('edit');
  const deleteIdParam = queryParams.get('delete');

  // 2. Form state (Enrollment vs Edit)
  const [editingStudent, setEditingStudent] = useState(() => {
    if (editIdParam) {
      const match = students.find(s => String(s.id) === String(editIdParam));
      return match || null;
    }
    return null;
  });

  const [deleteTarget, setDeleteTarget] = useState(() => {
    if (deleteIdParam) {
      const match = students.find(s => String(s.id) === String(deleteIdParam));
      return match || null;
    }
    return null;
  });

  // 3. Filter & Sort state
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [departmentFilter, setDepartmentFilter] = useState(initialDept);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name_asc');
  const [viewMode, setViewMode] = useState(initialView); // 'table' or 'card'

  // 4. Toast notification state
  const [notification, setNotification] = useState(() => {
    if (queryParams.get('toast') === '1') {
      return {
        message: 'Student record for "Sameet Pisal" enrolled successfully!',
        type: 'success'
      };
    }
    return null;
  });
  const formSectionRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3800);
  };

  // Scroll to form when Quick Enroll or Edit is clicked
  const scrollToForm = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add new student (CREATE)
  const handleAddStudent = (newStudent) => {
    // Check for duplicate PRN
    const prnExists = students.some(
      s => s.prn.trim().toLowerCase() === newStudent.prn.trim().toLowerCase()
    );
    if (prnExists) {
      showToast(`A student with PRN "${newStudent.prn}" already exists!`, 'error');
      return;
    }

    setStudents(prev => [newStudent, ...prev]);
    showToast(`Student "${newStudent.name}" enrolled successfully!`, 'success');
  };

  // Start Edit (UPDATE - Prep)
  const handleStartEdit = (student) => {
    setEditingStudent(student);
    scrollToForm();
  };

  // Save Edit (UPDATE - Commit)
  const handleUpdateStudent = (updatedStudent) => {
    setStudents(prev =>
      prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    setEditingStudent(null);
    showToast(`Record for "${updatedStudent.name}" updated successfully!`, 'success');
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  // Delete modal triggers (DELETE - Prep)
  const handleStartDelete = (student) => {
    setDeleteTarget(student);
  };

  // Confirm delete (DELETE - Commit)
  const handleConfirmDelete = (id) => {
    const studentToDelete = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    setDeleteTarget(null);
    if (editingStudent && editingStudent.id === id) {
      setEditingStudent(null);
    }
    showToast(
      `Student record for "${studentToDelete ? studentToDelete.name : 'Student'}" deleted.`,
      'info'
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('All Departments');
    setStatusFilter('All');
    setSortBy('name_asc');
  };

  // Filter & Sort Logic
  const filteredStudents = students
    .filter(student => {
      // Search matching (Name, PRN, Roll No, Dept, Email)
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.prn.toLowerCase().includes(q) ||
        student.rollNumber.toLowerCase().includes(q) ||
        (student.department && student.department.toLowerCase().includes(q)) ||
        (student.email && student.email.toLowerCase().includes(q));

      // Department filter
      const matchDept =
        departmentFilter === 'All Departments' ||
        student.department === departmentFilter;

      // Status filter
      const matchStatus =
        statusFilter === 'All' || student.status === statusFilter;

      return matchSearch && matchDept && matchStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'roll_asc':
          return parseInt(a.rollNumber || 0) - parseInt(b.rollNumber || 0);
        case 'cgpa_desc':
          return parseFloat(b.cgpa || 0) - parseFloat(a.cgpa || 0);
        case 'prn_asc':
          return a.prn.localeCompare(b.prn);
        default:
          return 0;
      }
    });

  // Export CSV
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      showToast('No records available to export.', 'error');
      return;
    }

    const headers = ['ID', 'Name', 'PRN', 'Roll Number', 'Department', 'Semester', 'CGPA', 'Email', 'Status'];
    const rows = filteredStudents.map(s => [
      s.id,
      `"${s.name}"`,
      `"${s.prn}"`,
      `"${s.rollNumber}"`,
      `"${s.department}"`,
      `"${s.semester}"`,
      s.cgpa || 'N/A',
      `"${s.email}"`,
      s.status || 'Active'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MITAOE_Student_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredStudents.length} student records as CSV.`, 'success');
  };

  return (
    <div className="sms-root">
      {/* Toast Notification */}
      {notification && (
        <div className={`notification-toast toast-${notification.type}`}>
          <span className="toast-icon">
            {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span className="toast-msg">{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="sms-app-container">
        {/* Header with MITAOE Branding & Student Info */}
        <Header
          totalStudents={students.length}
          onQuickEnrollClick={scrollToForm}
        />

        {/* Real-time Metric Statistics Cards */}
        <section className="portal-section">
          <StudentStats students={students} />
        </section>

        {/* Two-column layout on Desktop: Form (Left/Top) & Records (Right/Bottom) */}
        <div className="portal-layout-grid">
          {/* Enrollment & Update Form */}
          <section className="portal-form-col" ref={formSectionRef}>
            <StudentForm
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              editingStudent={editingStudent}
              onCancelEdit={handleCancelEdit}
            />
          </section>

          {/* Records Management Section */}
          <section className="portal-records-col">
            <div className="card-panel records-panel">
              <div className="panel-header records-header">
                <div>
                  <h2 className="panel-title">Student Directory & Records</h2>
                  <p className="panel-desc">
                    Comprehensive view with search, branch filters, sorting, and inline CRUD actions.
                  </p>
                </div>
              </div>

              {/* Filter, Search, Sort & View Mode Toolbar */}
              <StudentFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                departmentFilter={departmentFilter}
                onDepartmentChange={setDepartmentFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalCount={students.length}
                filteredCount={filteredStudents.length}
                onExportCSV={handleExportCSV}
              />

              {/* View Rendering: Table vs Grid Cards */}
              {viewMode === 'table' ? (
                <StudentTable
                  students={filteredStudents}
                  onEdit={handleStartEdit}
                  onDelete={handleStartDelete}
                  onResetFilters={handleResetFilters}
                />
              ) : (
                <div className="student-cards-grid">
                  {filteredStudents.length === 0 ? (
                    <div className="table-empty-card w-full">
                      <div className="empty-icon">📂</div>
                      <h3>No Student Records Found</h3>
                      <p>Try modifying your search or department filter.</p>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleResetFilters}
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    filteredStudents.map(student => (
                      <StudentCard
                        key={student.id}
                        student={student}
                        onEdit={handleStartEdit}
                        onDelete={handleStartDelete}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Delete Confirmation Modal Dialog */}
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          student={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />

        {/* Footer */}
        <footer className="portal-footer">
          <p>
            MIT Academy of Engineering (MITAOE), Alandi Road, Pune &bull; Full Stack Web Development Laboratory
          </p>
          <p className="footer-credits">
            Assignment 3: Student Management System in React JS &bull; Engineered by <strong>Sameet Pisal</strong> (PRN: 202401120018)
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
