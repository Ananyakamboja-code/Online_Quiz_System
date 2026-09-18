/**
 * Reusable stat card for Faculty dashboards and summary sections.
 * Displays a label, value, icon, and optional color accent.
 */
export default function StatCard({ title, value, icon, color = 'primary' }) {
  return (
    <div className="col-sm-6 col-lg-3 mb-3">
      <div className={`card faculty-stat-card border-0 shadow-sm h-100`}>
        <div className="card-body d-flex align-items-center gap-3">
          <div
            className={`faculty-stat-icon bg-${color} bg-opacity-10 text-${color} rounded-circle d-flex align-items-center justify-content-center`}
            style={{ width: 52, height: 52, fontSize: '1.4rem' }}
          >
            {icon}
          </div>
          <div>
            <p className="mb-0 text-muted small">{title}</p>
            <h4 className="mb-0 fw-bold">{value}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
