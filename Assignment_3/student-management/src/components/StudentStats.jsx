import React from 'react';

const StudentStats = ({ students }) => {
  const total = students.length;
  const activeCount = students.filter(s => s.status === 'Active').length;
  
  // Unique departments
  const depts = new Set(students.map(s => s.department));
  const deptCount = depts.size;

  // Average CGPA
  const validCgpaStudents = students.filter(s => s.cgpa && !isNaN(parseFloat(s.cgpa)));
  const avgCgpa = validCgpaStudents.length > 0
    ? (validCgpaStudents.reduce((acc, curr) => acc + parseFloat(curr.cgpa), 0) / validCgpaStudents.length).toFixed(2)
    : '0.00';

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon stat-icon-blue">🎓</div>
        <div className="stat-info">
          <span className="stat-label">Total Enrolled</span>
          <h3 className="stat-value">{total}</h3>
          <span className="stat-meta text-success">Verified Records</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon stat-icon-emerald">🏢</div>
        <div className="stat-info">
          <span className="stat-label">Departments</span>
          <h3 className="stat-value">{deptCount}</h3>
          <span className="stat-meta text-muted">Active Branches</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon stat-icon-amber">⭐</div>
        <div className="stat-info">
          <span className="stat-label">Average CGPA</span>
          <h3 className="stat-value">{avgCgpa} <span className="stat-unit">/ 10</span></h3>
          <span className="stat-meta text-primary">Academic Metric</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon stat-icon-purple">✅</div>
        <div className="stat-info">
          <span className="stat-label">Active Students</span>
          <h3 className="stat-value">{activeCount}</h3>
          <span className="stat-meta text-muted">{total > 0 ? `${Math.round((activeCount / total) * 100)}% attendance rate` : '0%'}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentStats;
