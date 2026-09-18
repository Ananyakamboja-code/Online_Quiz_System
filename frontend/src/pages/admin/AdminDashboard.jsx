import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services/adminService';

/**
 * Admin Dashboard.
 *
 * Renders inside AdminLayout (sidebar + navbar provided there). Shows summary
 * cards and quick navigation. Counts come from adminService, which is
 * mock-backed until the backend stats endpoint exists.
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalFaculty: 0,
    totalQuizzes: 0,
  });

  useEffect(() => {
    // Mock-backed promise today; same shape as a future API call.
    getDashboardStats().then(setStats);
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Total Students', value: stats.totalStudents },
    { label: 'Total Faculty', value: stats.totalFaculty },
    { label: 'Total Quizzes', value: stats.totalQuizzes },
  ];

  return (
    <div>
      <h1 className="h3 mb-1">Dashboard</h1>
      <p className="text-muted">Overview of the quiz system.</p>

      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div className="col-sm-6 col-xl-3" key={card.label}>
            <div className="card admin-stat-card shadow-sm h-100">
              <div className="card-body">
                <div className="stat-label">{card.label}</div>
                <div className="stat-value">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="h5 mb-3">Quick Navigation</h2>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/admin/quizzes" className="btn btn-primary">
          Manage Quizzes
        </Link>
        <Link to="/admin/results" className="btn btn-outline-primary">
          View Results
        </Link>
      </div>
    </div>
  );
}
