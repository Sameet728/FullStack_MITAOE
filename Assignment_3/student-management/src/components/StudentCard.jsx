import React from 'react';

const getInitials = (name) => {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name) => {
  const colors = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#ea580c'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const StudentCard = ({ student, onEdit, onDelete }) => {
  const initials = getInitials(student.name);
  const avatarBg = getAvatarColor(student.name);
  const cgpaVal = parseFloat(student.cgpa || 0);
  const cgpaPercent = Math.min(100, Math.max(0, (cgpaVal / 10) * 100));

  return (
    <div className="student-grid-card">
      <div className="card-top-row">
        <div className="card-profile-box">
          <div className="student-avatar" style={{ backgroundColor: avatarBg }}>
            {initials}
          </div>
          <div>
            <h4 className="card-student-name">{student.name}</h4>
            <span className="card-student-email">{student.email}</span>
          </div>
        </div>
        <span className={`status-pill status-pill-${student.status ? student.status.toLowerCase().replace(' ', '-') : 'active'}`}>
          {student.status || 'Active'}
        </span>
      </div>

      <div className="card-meta-grid">
        <div className="meta-box">
          <span className="meta-label">PRN</span>
          <span className="meta-val">{student.prn}</span>
        </div>
        <div className="meta-box">
          <span className="meta-label">Roll No</span>
          <span className="meta-val">#{student.rollNumber}</span>
        </div>
        <div className="meta-box col-span-2">
          <span className="meta-label">Department</span>
          <span className="meta-val">{student.department} &bull; {student.semester}</span>
        </div>
      </div>

      <div className="card-cgpa-section">
        <div className="cgpa-bar-header">
          <span className="cgpa-title">Academic CGPA</span>
          <span className="cgpa-score"><strong>{cgpaVal.toFixed(2)}</strong> / 10.0</span>
        </div>
        <div className="cgpa-progress-track">
          <div
            className="cgpa-progress-fill"
            style={{
              width: `${cgpaPercent}%`,
              backgroundColor: cgpaVal >= 9.0 ? '#10b981' : cgpaVal >= 7.5 ? '#3b82f6' : '#f59e0b'
            }}
          ></div>
        </div>
      </div>

      <div className="card-footer-actions">
        <button
          type="button"
          className="btn-action btn-edit flex-1"
          onClick={() => onEdit(student)}
        >
          ✏️ Edit Record
        </button>
        <button
          type="button"
          className="btn-action btn-delete"
          onClick={() => onDelete(student)}
          title="Delete student"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default StudentCard;
