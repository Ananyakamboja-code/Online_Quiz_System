import { useEffect, useMemo, useState } from 'react';
import { getResults } from '../../services/resultService';
import { getQuizzes } from '../../services/quizService';
import { getUserName, getQuizTitle, getQuizFacultyName } from '../../data/mockData';
import { formatDateTime, toPercentage } from '../../utils/format';

/**
 * Admin Results page.
 *
 * Shows student results with the faculty who created each quiz, the score,
 * total questions, computed percentage, and submission date. Includes search
 * (by student/quiz/faculty) and a filter by quiz. Read-only, mock-backed.
 */
export default function Results() {
  const [results, setResults] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState('');
  const [quizFilter, setQuizFilter] = useState('all');

  useEffect(() => {
    getResults().then(setResults);
    getQuizzes().then(setQuizzes);
  }, []);

  const rows = useMemo(() => {
    return results.map((r) => ({
      ...r,
      studentName: getUserName(r.student_id),
      quizTitle: getQuizTitle(r.quiz_id),
      facultyName: getQuizFacultyName(r.quiz_id),
    }));
  }, [results]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQuiz =
        quizFilter === 'all' || r.quiz_id === Number(quizFilter);
      const matchesSearch =
        !term ||
        r.studentName.toLowerCase().includes(term) ||
        r.quizTitle.toLowerCase().includes(term) ||
        r.facultyName.toLowerCase().includes(term) ||
        String(r.student_id).includes(term);
      return matchesQuiz && matchesSearch;
    });
  }, [rows, search, quizFilter]);

  return (
    <div>
      <h1 className="h3 mb-1">Results</h1>
      <p className="text-muted">Student quiz submissions and scores.</p>

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
                    <td>{r.student_id}</td>
                    <td className="fw-semibold">{r.studentName}</td>
                    <td>{r.quizTitle}</td>
                    <td>{r.facultyName}</td>
                    <td>{r.score}</td>
                    <td>{r.total_questions}</td>
                    <td>{toPercentage(r.score, r.total_questions)}</td>
                    <td className="text-muted">{formatDateTime(r.submitted_at)}</td>
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
