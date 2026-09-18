/**
 * Attractive confirmation modal for delete actions.
 * Uses Bootstrap modal classes + custom inline styles for the warning icon.
 *
 * Props:
 *  - show      (bool)     whether to display the modal
 *  - title     (string)   modal heading, e.g. "Delete Quiz"
 *  - message   (string)   body text, e.g. "Are you sure you want to delete this quiz?"
 *  - itemName  (string)   optional name of the item being deleted (shown highlighted)
 *  - onConfirm (fn)       called when user clicks Confirm / Yes, Delete
 *  - onCancel  (fn)       called when user clicks Cancel or backdrop
 */
export default function ConfirmModal({ show, title, message, itemName, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, transition: 'opacity 0.2s ease' }}
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="position-fixed top-50 start-50 translate-middle"
        style={{ zIndex: 1060, width: '94%', maxWidth: 440, animation: 'fadeInScale 0.25s ease' }}
      >
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Red accent top bar */}
          <div style={{ height: 5, background: 'linear-gradient(90deg, #e74a3b, #c0392b)' }} />

          <div className="card-body text-center px-4 py-4">
            {/* Warning icon */}
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: 72, height: 72,
                background: 'linear-gradient(135deg, #fce4e4, #fdd)',
                boxShadow: '0 4px 20px rgba(231, 74, 59, 0.2)',
              }}
            >
              <span style={{ fontSize: '2rem' }}>⚠️</span>
            </div>

            {/* Title */}
            <h5 className="fw-bold mb-2">{title || 'Confirm Delete'}</h5>

            {/* Message */}
            <p className="text-muted mb-1" style={{ fontSize: '0.95rem' }}>
              {message || 'Are you sure you want to delete this item?'}
            </p>

            {/* Item name highlight */}
            {itemName && (
              <p className="fw-semibold text-danger mb-0" style={{ fontSize: '1rem' }}>
                "{itemName}"
              </p>
            )}

            <p className="text-muted small mt-2 mb-0">This action cannot be undone.</p>
          </div>

          {/* Action buttons */}
          <div className="card-footer bg-white border-top-0 d-flex justify-content-center gap-3 pb-4 pt-0 px-4">
            <button
              className="btn btn-outline-secondary px-4 rounded-pill"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger px-4 rounded-pill d-flex align-items-center gap-2"
              onClick={onConfirm}
            >
              🗑️ Yes, Delete
            </button>
          </div>
        </div>
      </div>

      {/* Inline keyframe animation */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}
