import { useEffect, useMemo, useState } from 'react';
import { getResults } from '../../services/resultService';
import { getQuizzes } from '../../services/quizService';
import { formatDateTime } from '../../utils/format';

/**
 * Admin Results page.
 *
 * Shows student results with the faculty who created each quiz, the score,
 * total questions, percentage, and submission date. Includes search (by
 * student/quiz/faculty) and a filter by quiz. Read-only, backed by
 * /api/admin/results (which already returns names + percentage).
 */
export default function Results() {
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState('');
  const [quizFilter, setQuizFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    getResults()
      .then(setResults)
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load results.'));
    getQuizzes()
      .then(setQuizzes)
      .catch(() => {/* quiz filter is optional; ignore */});
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return results.filter((r) => {
      const matchesQuiz =
        quizFilter === 'all' || r.quizId === Number(quizFilter);
      const matchesSearch =
        !term ||
        (r.studentName || '').toLowerCase().includes(term) ||
        (r.quizTitle || '').toLowerCase().includes(term) ||
        (r.facultyName || '').toLowerCase().includes(term) ||
        String(r.studentId).includes(term);
      return matchesQuiz && matchesSearch;
    });
  }, [results, search, quizFilter]);

  return (
    <div>
      <h1 className="h3 mb-1">Results</h1>
      <p className="text-muted">Student quiz submissions and scores.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Search by student, quiz, or faculty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search results"
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={quizFilter}
            onChange={(e) => setQuizFilter(e.target.value)}
            aria-label="Filter by quiz"
          >
            <option value="all">All quizzes</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '80px' }}>Std ID</th>
                <th>Student</th>
                <th>Quiz</th>
                <th>Faculty</th>
                <th style={{ width: '80px' }}>Score</th>
                <th style={{ width: '90px' }}>Total</th>
                <th style={{ width: '110px' }}>Percentage</th>
                <th style={{ width: '180px' }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No results found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>{r.studentId}</td>
                    <td className="fw-semibold">{r.studentName}</td>
                    <td>{r.quizTitle}</td>
                    <td>{r.facultyName}</td>
                    <td>{r.score}</td>
                    <td>{r.totalQuestions}</td>
                    <td>{r.percentage}%</td>
                    <td className="text-muted">{formatDateTime(r.submittedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
