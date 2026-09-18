import { useState } from 'react';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import StatCard from '../../components/faculty/StatCard';

/* ── Dummy data ─────────────────────────────────────────── */
const QUIZ_OPTIONS = [
  'All Quizzes',
  'Data Structures Mid-Term',
  'OOP Concepts Quiz',
  'Database Fundamentals',
  'Web Development Basics',
  'Algorithms Final',
];

const RESULTS_DATA = [
  { id: 1,  name: 'Rahul Sharma',   email: 'rahul@example.com',   quiz: 'Data Structures Mid-Term', score: 22, total: 25, submitted: '2026-09-12' },
  { id: 2,  name: 'Priya Patel',    email: 'priya@example.com',   quiz: 'OOP Concepts Quiz',        score: 18, total: 20, submitted: '2026-09-11' },
  { id: 3,  name: 'Amit Kumar',     email: 'amit@example.com',    quiz: 'Data Structures Mid-Term', score: 19, total: 25, submitted: '2026-09-11' },
  { id: 4,  name: 'Sneha Gupta',    email: 'sneha@example.com',   quiz: 'Database Fundamentals',    score: 25, total: 30, submitted: '2026-09-10' },
  { id: 5,  name: 'Vikram Singh',   email: 'vikram@example.com',  quiz: 'OOP Concepts Quiz',        score: 16, total: 20, submitted: '2026-09-09' },
  { id: 6,  name: 'Ananya Reddy',   email: 'ananya@example.com',  quiz: 'Data Structures Mid-Term', score: 23, total: 25, submitted: '2026-09-08' },
  { id: 7,  name: 'Rohan Desai',    email: 'rohan@example.com',   quiz: 'Web Development Basics',   score: 13, total: 15, submitted: '2026-09-07' },
  { id: 8,  name: 'Kavya Nair',     email: 'kavya@example.com',   quiz: 'Algorithms Final',         score: 32, total: 40, submitted: '2026-09-06' },
  { id: 9,  name: 'Suresh Menon',   email: 'suresh@example.com',  quiz: 'Database Fundamentals',    score: 20, total: 30, submitted: '2026-09-05' },
  { id: 10, name: 'Deepika Joshi',  email: 'deepika@example.com', quiz: 'OOP Concepts Quiz',        score: 17, total: 20, submitted: '2026-09-04' },
];

/* ── Component ──────────────────────────────────────────── */
export default function StudentResults() {
  const [search, setSearch] = useState('');
  const [quizFilter, setQuizFilter] = useState('All Quizzes');

  /* Filter */
  const filtered = RESULTS_DATA.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchesQuiz = quizFilter === 'All Quizzes' || r.quiz === quizFilter;
    return matchesSearch && matchesQuiz;
  });

  /* Summary stats */
  const percentages = filtered.map((r) => (r.score / r.total) * 100);
  const totalAttempts = filtered.length;
  const avgScore   = totalAttempts ? (percentages.reduce((a, b) => a + b, 0) / totalAttempts).toFixed(1) : 0;
  const highest    = totalAttempts ? Math.max(...percentages).toFixed(1) : 0;
  const lowest     = totalAttempts ? Math.min(...percentages).toFixed(1) : 0;

  return (
    <div className="faculty-layout d-flex flex-column min-vh-100">
      <FacultyHeader />
      <div className="d-flex flex-grow-1">
        <FacultySidebar />
        <main className="faculty-content flex-grow-1 p-4 bg-light">
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Student Results</h2>
            <p className="text-muted">View and filter student performance across your quizzes.</p>
          </div>

          {/* Summary stat cards */}
          <div className="row">
            <StatCard title="Total Attempts"  value={totalAttempts}    icon="📋" color="primary" />
            <StatCard title="Average Score"   value={`${avgScore}%`}   icon="📊" color="info"    />
            <StatCard title="Highest Score"   value={`${highest}%`}    icon="🏆" color="success" />
            <StatCard title="Lowest Score"    value={`${lowest}%`}     icon="📉" color="danger"  />
          </div>

          {/* Filters */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="search" className="form-label fw-semibold">Search Student</label>
                  <input type="text" className="form-control" id="search"
                    placeholder="Search by name or email..." value={search}
                    onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="quizFilter" className="form-label fw-semibold">Filter by Quiz</label>
                  <select className="form-select" id="quizFilter"
                    value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
                    {QUIZ_OPTIONS.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results table */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Student Email</th>
                      <th>Quiz Name</th>
                      <th>Score</th>
                      <th>Total Questions</th>
                      <th>Percentage</th>
                      <th>Submitted Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan="9" className="text-center text-muted py-4">No results found.</td></tr>
                    ) : (
                      filtered.map((r, i) => {
                        const pct = ((r.score / r.total) * 100).toFixed(1);
                        const pass = pct >= 60;
                        return (
                          <tr key={r.id}>
                            <td>{i + 1}</td>
                            <td className="fw-medium">{r.name}</td>
                            <td className="text-muted">{r.email}</td>
                            <td>{r.quiz}</td>
                            <td>{r.score}</td>
                            <td>{r.total}</td>
                            <td><span className={`badge bg-${pass ? 'success' : 'danger'}`}>{pct}%</span></td>
                            <td>{r.submitted}</td>
                            <td><span className={`badge bg-${pass ? 'success' : 'danger'}`}>{pass ? 'Pass' : 'Fail'}</span></td>
                          </tr>
                        );
                      })
                    )}
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
