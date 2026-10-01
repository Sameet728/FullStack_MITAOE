import React, { useEffect } from 'react';

const DeleteConfirmModal = ({ isOpen, student, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !student) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-icon-badge">
          ⚠️
        </div>
        
        <h3 id="modal-title" className="modal-title">Confirm Record Deletion</h3>
        
        <p className="modal-description">
          Are you sure you want to delete the student record for{' '}
          <strong>{student.name}</strong> (PRN: <code>{student.prn}</code>)?
        </p>
        <p className="modal-subtext">
          This record will be permanently removed from the active student database.
        </p>

        <div className="modal-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={() => onConfirm(student.id)}
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
