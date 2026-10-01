import React from 'react';

const Header = ({ totalStudents, onQuickEnrollClick }) => {
  return (
    <header className="portal-header">
      <div className="portal-header-top">
        <div className="brand-group">
          <div className="brand-badge">MITAOE</div>
          <div>
            <h1 className="portal-title">Student Information Management System</h1>
            <p className="portal-subtitle">Department of Computer Engineering &bull; Academic Portal</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="admin-chip">
            <div className="admin-avatar">SP</div>
            <div className="admin-meta">
              <span className="admin-name">Sameet Pisal</span>
              <span className="admin-role">PRN: 202401120018</span>
            </div>
          </div>
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={onQuickEnrollClick}
          >
            + Enroll Student
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
