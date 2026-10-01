import React, { useState } from 'react';
import './index.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [prn, setPrn] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim() || !department.trim() || !prn.trim()) return;

    const newStudent = {
      id: Date.now(),
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      department: department.trim(),
      prn: prn.trim()
    };

    setStudents([newStudent, ...students]);
    setName('');
    setRollNumber('');
    setDepartment('');
    setPrn('');
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Student Portal</h1>
        <p>Manage your classroom records effortlessly</p>
      </header>

      <main>
        <section className="glass-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Student Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sameet"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="rollNumber">Roll Number</label>
                <input
                  type="text"
                  id="rollNumber"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 41"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. DS"
                  autoComplete="off"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="prn">PRN</label>
                <input
                  type="text"
                  id="prn"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value)}
                  placeholder="e.g. 202401120018"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Enroll Student
            </button>
          </form>
        </section>

        <section className="glass-panel">
          <div className="students-list">
            {students.length === 0 ? (
              <div className="empty-state">
                <p>No students added yet. Use the form above to enroll a student.</p>
              </div>
            ) : (
              students.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-info">
                    <h3>{student.name}</h3>
                    <div className="student-meta">
                      <span><strong>Dept:</strong> {student.department}</span>
                    </div>
                  </div>
                  <div className="badges-container">
                    <div className="badge badge-primary">Roll: {student.rollNumber}</div>
                    <div className="badge badge-secondary">PRN: {student.prn}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
