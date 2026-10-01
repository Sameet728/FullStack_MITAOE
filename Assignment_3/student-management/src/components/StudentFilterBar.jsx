import React from 'react';

const DEPARTMENTS = [
  'All Departments',
  'Data Science',
  'Computer Engineering',
  'Information Technology',
  'AI & Machine Learning',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering'
];

const StudentFilterBar = ({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  onExportCSV
}) => {
  return (
    <div className="filter-panel">
      <div className="filter-row">
        {/* Search Input */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by student name, PRN, or roll number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="filter-controls">
          {/* Department Filter */}
          <div className="select-wrapper">
            <select
              value={departmentFilter}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="filter-select"
            >
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="select-wrapper">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="filter-select"
            >
              <option value="name_asc">Sort: Name (A-Z)</option>
              <option value="name_desc">Sort: Name (Z-A)</option>
              <option value="roll_asc">Sort: Roll No (Asc)</option>
              <option value="cgpa_desc">Sort: CGPA (High-Low)</option>
              <option value="prn_asc">Sort: PRN</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              type="button"
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
            >
              📋 Table
            </button>
            <button
              type="button"
              className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => onViewModeChange('card')}
              title="Cards View"
            >
              🗂️ Cards
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            className="btn btn-outline btn-sm export-btn"
            onClick={onExportCSV}
            title="Export filtered records as CSV"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="filter-summary">
        <span className="results-badge">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> student records
        </span>
        {(searchQuery || departmentFilter !== 'All Departments' || statusFilter !== 'All') && (
          <span className="active-filters-label">
            Filtered results &bull; Filters currently applied
          </span>
        )}
      </div>
    </div>
  );
};

export default StudentFilterBar;
