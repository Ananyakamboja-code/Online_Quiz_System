import { useState, useEffect } from 'react';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import StatCard from '../../components/faculty/StatCard';
import { getStudentResults, getMyQuizzes } from '../../services/facultyApi';

export default function StudentResults() {
  const [quizList, setQuizList] = useState([]);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ totalAttempts: 0, avgScore: 0, highestScore: 0, lowestScore: 0 });
  const [search, setSearch] = useState('');
  const [quizFilter, setQuizFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getMyQuizzes().then(setQuizList).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getStudentResults(quizFilter || undefined)
      .then((data) => {
        setResults(data.results);
        setSummary(data.summary);
        setErrorMsg('');
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, [quizFilter]);

  const filtered = results.filter((r) =>
    r.student.name.toLowerCase().includes(search.toLowerCase()) ||
    r.student.email.toLowerCase().includes(search.toLowerCase())
  );

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

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <div className="row">
            <StatCard title="Total Attempts" value={summary.totalAttempts} icon="📋" color="primary" />
            <StatCard title="Average Score" value={`${summary.avgScore}%`} icon="📊" color="info" />
            <StatCard title="Highest Score" value={`${summary.highestScore}%`} icon="🏆" color="success" />
            <StatCard title="Lowest Score" value={`${summary.lowestScore}%`} icon="📉" color="danger" />
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="search" className="form-label fw-semibold">Search Student</label>
                  <input type="text" className="form-control" id="search" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="quizFilter" className="form-label fw-semibold">Filter by Quiz</label>
                  <select className="form-select" id="quizFilter" value={quizFilter} onChange={(e) => setQuizFilter(e.target.value)}>
                    <option value="">All Quizzes</option>
                    {quizList.map((q) => (<option key={q.id} value={q.id}>{q.title}</option>))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr><th>#</th><th>Student Name</th><th>Email</th><th>Quiz</th><th>Score</th><th>Total</th><th>Percentage</th><th>Date</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr><td colSpan="9" className="text-center text-muted py-4">No results found.</td></tr>
                      ) : filtered.map((r, i) => {
                        const pct = ((r.score / r.totalQuestions) * 100).toFixed(1);
                        const pass = pct >= 60;
                        return (
                          <tr key={r.id}>
                            <td>{i + 1}</td>
                            <td className="fw-medium">{r.student.name}</td>
                            <td className="text-muted">{r.student.email}</td>
                            <td>{r.quiz.title}</td>
                            <td>{r.score}</td>
                            <td>{r.totalQuestions}</td>
                            <td><span className={`badge bg-${pass ? 'success' : 'danger'}`}>{pct}%</span></td>
                            <td>{new Date(r.submittedAt).toLocaleDateString()}</td>
                            <td><span className={`badge bg-${pass ? 'success' : 'danger'}`}>{pass ? 'Pass' : 'Fail'}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
