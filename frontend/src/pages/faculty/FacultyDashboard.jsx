import { Link } from 'react-router-dom';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import StatCard from '../../components/faculty/StatCard';

/* ── Dummy data ─────────────────────────────────────────── */
const STATS = [
  { title: 'Total Quizzes',    value: 12,  icon: '📝', color: 'primary' },
  { title: 'Active Quizzes',   value: 5,   icon: '🟢', color: 'success' },
  { title: 'Total Questions',  value: 120, icon: '❓', color: 'info'    },
  { title: 'Student Attempts', value: 340, icon: '👨‍🎓', color: 'warning' },
];

const RECENT_QUIZZES = [
  { id: 1, title: 'Data Structures Mid-Term',  status: 'Active',   date: '2026-09-10', questions: 25 },
  { id: 2, title: 'OOP Concepts Quiz',         status: 'Active',   date: '2026-09-08', questions: 20 },
  { id: 3, title: 'Database Fundamentals',      status: 'Inactive', date: '2026-09-01', questions: 30 },
  { id: 4, title: 'Web Development Basics',     status: 'Draft',    date: '2026-08-28', questions: 15 },
  { id: 5, title: 'Algorithms Final',           status: 'Active',   date: '2026-08-25', questions: 40 },
];

const RECENT_RESULTS = [
  { id: 1, student: 'Rahul Sharma',  quiz: 'Data Structures Mid-Term', score: 22, total: 25, date: '2026-09-12' },
  { id: 2, student: 'Priya Patel',   quiz: 'OOP Concepts Quiz',        score: 18, total: 20, date: '2026-09-11' },
  { id: 3, student: 'Amit Kumar',    quiz: 'Data Structures Mid-Term', score: 19, total: 25, date: '2026-09-11' },
  { id: 4, student: 'Sneha Gupta',   quiz: 'Database Fundamentals',    score: 25, total: 30, date: '2026-09-10' },
  { id: 5, student: 'Vikram Singh',  quiz: 'OOP Concepts Quiz',        score: 16, total: 20, date: '2026-09-09' },
];

/* ── Subject-wise results data for graphs ────────────────── */
const SUBJECT_RESULTS = [
  { subject: 'Data Structures',    avgScore: 82, students: 45, pass: 38, fail: 7,  color: '#4e73df' },
  { subject: 'OOP Concepts',       avgScore: 75, students: 38, pass: 30, fail: 8,  color: '#1cc88a' },
  { subject: 'Database',           avgScore: 68, students: 32, pass: 22, fail: 10, color: '#36b9cc' },
  { subject: 'Web Development',    avgScore: 88, students: 28, pass: 26, fail: 2,  color: '#f6c23e' },
  { subject: 'Algorithms',         avgScore: 62, students: 40, pass: 25, fail: 15, color: '#e74a3b' },
  { subject: 'Computer Networks',  avgScore: 71, students: 35, pass: 27, fail: 8,  color: '#858796' },
];

/* ── Helpers ─────────────────────────────────────────────── */
const statusBadge = (status) => {
  const map = { Active: 'success', Inactive: 'secondary', Draft: 'warning' };
  return <span className={`badge bg-${map[status] || 'secondary'}`}>{status}</span>;
};

/* ── Component ──────────────────────────────────────────── */
export default function FacultyDashboard() {
  return (
    <div className="faculty-layout d-flex flex-column min-vh-100">
      <FacultyHeader />
      <div className="d-flex flex-grow-1">
        <FacultySidebar />
        <main className="faculty-content flex-grow-1 p-4 bg-light">
          {/* Welcome */}
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Welcome, Faculty! 👋</h2>
            <p className="text-muted mb-0">Here's a quick overview of your quizzes and student activity.</p>
          </div>

          {/* Stat cards */}
          <div className="row">
            {STATS.map((s) => (
              <StatCard key={s.title} {...s} />
            ))}
          </div>

          {/* ── Subject-wise Results Graphs ────────────────── */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">📊 Subject-wise Average Scores</h5>
              <Link to="/faculty/results" className="btn btn-sm btn-outline-primary">View Detailed Results</Link>
            </div>
            <div className="card-body">
              {/* Bar chart built with CSS — no external library */}
              <div className="row g-3">
                {SUBJECT_RESULTS.map((s) => (
                  <div className="col-md-6" key={s.subject}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-medium small">{s.subject}</span>
                      <span className="fw-bold small">{s.avgScore}%</span>
                    </div>
                    <div className="progress" style={{ height: 22, borderRadius: 6 }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${s.avgScore}%`, backgroundColor: s.color, transition: 'width 0.8s ease' }}
                        aria-valuenow={s.avgScore}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        {s.avgScore}%
                      </div>
                    </div>
                    <div className="d-flex gap-3 mt-1">
                      <small className="text-muted">{s.students} students</small>
                      <small className="text-success">✅ {s.pass} pass</small>
                      <small className="text-danger">❌ {s.fail} fail</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Pass vs Fail — SVG Bar Graph ─────────────── */}
          {(() => {
            const maxStudents = Math.max(...SUBJECT_RESULTS.map((s) => s.students));
            const chartH = 220;
            const barAreaW = 600;
            const labelW = 50;
            const gap = 14;
            const groupW = (barAreaW - gap * (SUBJECT_RESULTS.length - 1)) / SUBJECT_RESULTS.length;
            const barW = (groupW - 6) / 2;

            return (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold">📈 Pass vs Fail — By Subject</h5>
                  <div className="d-flex gap-3 align-items-center">
                    <small className="d-flex align-items-center gap-1">
                      <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, backgroundColor: '#1cc88a' }}></span> Pass
                    </small>
                    <small className="d-flex align-items-center gap-1">
                      <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, backgroundColor: '#e74a3b' }}></span> Fail
                    </small>
                  </div>
                </div>
                <div className="card-body d-flex justify-content-center">
                  <svg viewBox={`0 0 ${labelW + barAreaW + 10} ${chartH + 60}`}
                       style={{ width: '100%', maxWidth: 720, height: 'auto' }}
                       role="img" aria-label="Pass vs Fail bar graph by subject">
                    {/* Y-axis grid lines & labels */}
                    {[0, 0.25, 0.5, 0.75, 1].map((f) => {
                      const y = chartH - f * chartH + 10;
                      const val = Math.round(f * maxStudents);
                      return (
                        <g key={f}>
                          <line x1={labelW} y1={y} x2={labelW + barAreaW} y2={y}
                                stroke="#e9ecef" strokeWidth="1" />
                          <text x={labelW - 8} y={y + 4} textAnchor="end"
                                fontSize="10" fill="#6c757d">{val}</text>
                        </g>
                      );
                    })}

                    {/* Bars */}
                    {SUBJECT_RESULTS.map((s, i) => {
                      const x = labelW + i * (groupW + gap);
                      const passH = (s.pass / maxStudents) * chartH;
                      const failH = (s.fail / maxStudents) * chartH;
                      const baseY = chartH + 10;
                      return (
                        <g key={s.subject}>
                          {/* Pass bar */}
                          <rect x={x} y={baseY - passH} width={barW} height={passH}
                                rx="4" fill="#1cc88a">
                            <title>Pass: {s.pass}</title>
                          </rect>
                          <text x={x + barW / 2} y={baseY - passH - 5}
                                textAnchor="middle" fontSize="9" fontWeight="600" fill="#1cc88a">
                            {s.pass}
                          </text>

                          {/* Fail bar */}
                          <rect x={x + barW + 6} y={baseY - failH} width={barW} height={failH}
                                rx="4" fill="#e74a3b">
                            <title>Fail: {s.fail}</title>
                          </rect>
                          <text x={x + barW + 6 + barW / 2} y={baseY - failH - 5}
                                textAnchor="middle" fontSize="9" fontWeight="600" fill="#e74a3b">
                            {s.fail}
                          </text>

                          {/* X-axis label */}
                          <text x={x + groupW / 2} y={baseY + 18}
                                textAnchor="middle" fontSize="9" fontWeight="500" fill="#333">
                            {s.subject.length > 12 ? s.subject.slice(0, 11) + '…' : s.subject}
                          </text>
                          <text x={x + groupW / 2} y={baseY + 30}
                                textAnchor="middle" fontSize="8" fill="#6c757d">
                            {s.students} students
                          </text>
                        </g>
                      );
                    })}

                    {/* X-axis line */}
                    <line x1={labelW} y1={chartH + 10} x2={labelW + barAreaW} y2={chartH + 10}
                          stroke="#ccc" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            );
          })()}

          {/* Recent Quizzes */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Recent Quizzes</h5>
              <Link to="/faculty/my-quizzes" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Quiz Title</th>
                      <th>Questions</th>
                      <th>Status</th>
                      <th>Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_QUIZZES.map((q, i) => (
                      <tr key={q.id}>
                        <td>{i + 1}</td>
                        <td className="fw-medium">{q.title}</td>
                        <td>{q.questions}</td>
                        <td>{statusBadge(q.status)}</td>
                        <td>{q.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Results */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">Recent Results</h5>
              <Link to="/faculty/results" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Quiz</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_RESULTS.map((r, i) => (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td className="fw-medium">{r.student}</td>
                        <td>{r.quiz}</td>
                        <td>{r.score}/{r.total}</td>
                        <td>
                          <span className={`badge bg-${(r.score / r.total) * 100 >= 60 ? 'success' : 'danger'}`}>
                            {((r.score / r.total) * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td>{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
