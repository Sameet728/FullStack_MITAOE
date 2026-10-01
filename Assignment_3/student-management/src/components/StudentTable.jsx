import React from 'react';

// Generates consistent initials
const getInitials = (name) => {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Generates consistent soft color based on name string
const getAvatarColor = (name) => {
  const colors = [
    '#2563eb', // blue
    '#059669', // emerald
    '#d97706', // amber
    '#7c3aed', // violet
    '#db2777', // pink
    '#0891b2', // cyan
    '#ea580c'  // orange
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getCgpaBadgeClass = (cgpa) => {
  const val = parseFloat(cgpa);
  if (isNaN(val)) return 'cgpa-neutral';
  if (val >= 9.0) return 'cgpa-excellent';
  if (val >= 8.0) return 'cgpa-good';
  if (val >= 6.5) return 'cgpa-average';
  return 'cgpa-low';
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Active':
      return 'status-badge-active';
    case 'On Leave':
      return 'status-badge-leave';
    case 'Graduated':
      return 'status-badge-graduated';
    default:
      return 'status-badge-neutral';
  }
};

const StudentTable = ({ students, onEdit, onDelete, onResetFilters }) => {
  if (students.length === 0) {
    return (
      <div className="table-empty-card">
        <div className="empty-icon">📂</div>
        <h3>No Student Records Found</h3>
        <p>No student records matched your current query or filter criteria.</p>
        {onResetFilters && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="custom-student-table">
        <thead>
          <tr>
            <th>Student Profile</th>
            <th>PRN</th>
            <th>Roll No</th>
            <th>Department & Semester</th>
            <th>CGPA</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const avatarBg = getAvatarColor(student.name);
            const initials = getInitials(student.name);
            const cgpaClass = getCgpaBadgeClass(student.cgpa);
            const statusClass = getStatusBadgeClass(student.status);

            return (
              <tr key={student.id} className="student-row">
                {/* Profile column */}
                <td>
                  <div className="student-cell-profile">
                    <div
                      className="student-avatar"
                      style={{ backgroundColor: avatarBg }}
                    >
                      {initials}
                    </div>
                    <div className="student-names">
                      <span className="student-full-name">{student.name}</span>
                      <span className="student-email">{student.email}</span>
                    </div>
                  </div>
                </td>

                {/* PRN */}
                <td>
                  <span className="code-badge">{student.prn}</span>
                </td>

                {/* Roll No */}
                <td>
                  <span className="roll-badge">#{student.rollNumber}</span>
                </td>

                {/* Dept & Semester */}
                <td>
                  <div className="dept-cell">
                    <span className="dept-name">{student.department}</span>
                    <span className="semester-pill">{student.semester}</span>
                  </div>
                </td>

                {/* CGPA */}
                <td>
                  <span className={`cgpa-pill ${cgpaClass}`}>
                    ⭐ {parseFloat(student.cgpa || 0).toFixed(2)}
                  </span>
                </td>

                {/* Status */}
                <td>
                  <span className={`status-pill ${statusClass}`}>
                    <span className="status-dot"></span>
                    {student.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="text-right">
                  <div className="action-buttons-group">
                    <button
                      type="button"
                      className="btn-action btn-edit"
                      onClick={() => onEdit(student)}
                      title={`Edit record for ${student.name}`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      className="btn-action btn-delete"
                      onClick={() => onDelete(student)}
                      title={`Delete record for ${student.name}`}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
