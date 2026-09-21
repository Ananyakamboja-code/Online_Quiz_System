import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import StatCard from '../../components/faculty/StatCard';
import { getDashboardStats } from '../../services/facultyApi';

const CHART_COLORS = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#6f42c1', '#fd7e14'];

const statusBadge = (status) => {
  const map = { Active: 'success', Inactive: 'secondary', Draft: 'warning' };
  return <span className={`badge bg-${map[status] || 'secondary'}`}>{status}</span>;
};

export default function FacultyDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then((data) => { setStats(data); setErrorMsg(''); })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="faculty-layout d-flex flex-column min-vh-100">
        <FacultyHeader />
        <div className="d-flex flex-grow-1">
          <FacultySidebar />
          <main className="faculty-content flex-grow-1 p-4 bg-light d-flex justify-content-center align-items-center">
            <div className="text-center"><div className="spinner-border text-primary mb-3" style={{ width: 48, height: 48 }}></div><p className="text-muted">Loading dashboard...</p></div>
          </main>
        </div>
      </div>
    );
  }

  const subjectStats = stats?.subjectStats || [];
  const recentQuizzes = stats?.recentQuizzes || [];
  const recentResults = stats?.recentResults || [];

  return (
    <div className="faculty-layout d-flex flex-column min-vh-100">
      <FacultyHeader />
      <div className="d-flex flex-grow-1">
        <FacultySidebar />
        <main className="faculty-content flex-grow-1 p-4 bg-light">
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Welcome, Faculty! 👋</h2>
            <p className="text-muted mb-0">Here's a quick overview of your quizzes and student activity.</p>
          </div>

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          {/* Stat cards */}
          <div className="row">
            <StatCard title="Total Quizzes"    value={stats?.totalQuizzes || 0}    icon="📝" color="primary" />
            <StatCard title="Active Quizzes"   value={stats?.activeQuizzes || 0}   icon="🟢" color="success" />
            <StatCard title="Total Questions"  value={stats?.totalQuestions || 0}  icon="❓" color="info" />
            <StatCard title="Student Attempts" value={stats?.totalAttempts || 0}   icon="👨‍🎓" color="warning" />
          </div>

          {/* Subject-wise Average Scores */}
          {subjectStats.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">📊 Subject-wise Average Scores</h5>
                <Link to="/faculty/results" className="btn btn-sm btn-outline-primary">View Detailed Results</Link>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {subjectStats.map((s, i) => (
                    <div className="col-md-6" key={s.quizId}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-medium small">{s.subject}</span>
                        <span className="fw-bold small">{s.avgScore}%</span>
                      </div>
                      <div className="progress" style={{ height: 22, borderRadius: 6 }}>
                        <div className="progress-bar" role="progressbar"
                          style={{ width: `${s.avgScore}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length], transition: 'width 0.8s ease' }}
                          aria-valuenow={s.avgScore} aria-valuemin={0} aria-valuemax={100}>{s.avgScore}%</div>
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
          )}

          {/* Pass vs Fail Bar Graph */}
          {subjectStats.length > 0 && (() => {
            const maxStudents = Math.max(...subjectStats.map((s) => s.students), 1);
            const chartH = 220; const barAreaW = 600; const labelW = 50; const gap = 14;
            const groupW = (barAreaW - gap * (subjectStats.length - 1)) / subjectStats.length;
            const barW = (groupW - 6) / 2;
            return (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold">📈 Pass vs Fail — By Subject</h5>
                  <div className="d-flex gap-3 align-items-center">
                    <small className="d-flex align-items-center gap-1"><span style={{ display:'inline-block',width:12,height:12,borderRadius:3,backgroundColor:'#1cc88a' }}></span> Pass</small>
                    <small className="d-flex align-items-center gap-1"><span style={{ display:'inline-block',width:12,height:12,borderRadius:3,backgroundColor:'#e74a3b' }}></span> Fail</small>
                  </div>
                </div>
                <div className="card-body d-flex justify-content-center">
                  <svg viewBox={`0 0 ${labelW+barAreaW+10} ${chartH+60}`} style={{ width:'100%',maxWidth:720,height:'auto' }}>
                    {[0,0.25,0.5,0.75,1].map((f)=>{const y=chartH-f*chartH+10;return(<g key={f}><line x1={labelW} y1={y} x2={labelW+barAreaW} y2={y} stroke="#e9ecef" strokeWidth="1"/><text x={labelW-8} y={y+4} textAnchor="end" fontSize="10" fill="#6c757d">{Math.round(f*maxStudents)}</text></g>);})}
                    {subjectStats.map((s,i)=>{const x=labelW+i*(groupW+gap);const passH=(s.pass/maxStudents)*chartH;const failH=(s.fail/maxStudents)*chartH;const baseY=chartH+10;return(
                      <g key={s.quizId}><rect x={x} y={baseY-passH} width={barW} height={passH} rx="4" fill="#1cc88a"/><text x={x+barW/2} y={baseY-passH-5} textAnchor="middle" fontSize="9" fontWeight="600" fill="#1cc88a">{s.pass}</text><rect x={x+barW+6} y={baseY-failH} width={barW} height={failH||1} rx="4" fill="#e74a3b"/><text x={x+barW+6+barW/2} y={baseY-failH-5} textAnchor="middle" fontSize="9" fontWeight="600" fill="#e74a3b">{s.fail}</text><text x={x+groupW/2} y={baseY+18} textAnchor="middle" fontSize="9" fontWeight="500" fill="#333">{s.subject.length>12?s.subject.slice(0,11)+'…':s.subject}</text></g>
                    );})}
                    <line x1={labelW} y1={chartH+10} x2={labelW+barAreaW} y2={chartH+10} stroke="#ccc" strokeWidth="1.5"/>
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
                  <thead className="table-light"><tr><th>#</th><th>Quiz Title</th><th>Questions</th><th>Status</th><th>Created Date</th></tr></thead>
                  <tbody>
                    {recentQuizzes.length === 0 ? (
                      <tr><td colSpan="5" className="text-center text-muted py-4">No quizzes yet.</td></tr>
                    ) : recentQuizzes.map((q, i) => (
                      <tr key={q.id}><td>{i+1}</td><td className="fw-medium">{q.title}</td><td>{q.numberOfQuestions}</td><td>{statusBadge(q.status)}</td><td>{new Date(q.createdAt).toLocaleDateString()}</td></tr>
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
                  <thead className="table-light"><tr><th>#</th><th>Student</th><th>Quiz</th><th>Score</th><th>Percentage</th><th>Date</th></tr></thead>
                  <tbody>
                    {recentResults.length === 0 ? (
                      <tr><td colSpan="6" className="text-center text-muted py-4">No results yet.</td></tr>
                    ) : recentResults.map((r, i) => (
                      <tr key={r.id}><td>{i+1}</td><td className="fw-medium">{r.student.name}</td><td>{r.quiz.title}</td><td>{r.score}/{r.totalQuestions}</td>
                        <td><span className={`badge bg-${(r.score/r.totalQuestions)*100>=60?'success':'danger'}`}>{((r.score/r.totalQuestions)*100).toFixed(0)}%</span></td>
                        <td>{new Date(r.submittedAt).toLocaleDateString()}</td></tr>
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
