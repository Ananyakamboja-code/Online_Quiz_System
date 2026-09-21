import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuizzes, deleteQuiz } from '../../services/quizService';
import { formatDate } from '../../utils/format';

/**
 * Quiz Management (Admin).
 *
 * Lists all quizzes with search and actions to view details, edit, and delete.
 * Admin manages quiz-level data only — there is NO question management here
 * (questions are owned by the Faculty module). Data comes from the backend
 * via quizService.
 */
export default function QuizManagement() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [detailsQuiz, setDetailsQuiz] = useState(null);

  const refresh = () => {
    setLoading(true);
    setError('');
    getQuizzes()
      .then(setQuizzes)
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load quizzes.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return quizzes;
    return quizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(term) ||
        q.description.toLowerCase().includes(term) ||
        (q.facultyName || '').toLowerCase().includes(term)
    );
  }, [quizzes, search]);

  const handleDelete = async (quiz) => {
    const ok = window.confirm(`Delete quiz "${quiz.title}"?`);
    if (!ok) return;
    try {
      await deleteQuiz(quiz.id);
      refresh();
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete quiz.');
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div>
          <h1 className="h3 mb-1">Quiz Management</h1>
          <p className="text-muted mb-0">Create, edit, and organize quizzes.</p>
        </div>
        <Link to="/admin/quizzes/create" className="btn btn-primary">
          + Add Quiz
        </Link>
      </div>

      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search quizzes by title, description, or faculty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search quizzes"
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>Quiz Title</th>
                <th>Description</th>
                <th style={{ width: '110px' }}>Duration</th>
                <th style={{ width: '150px' }}>Created By</th>
                <th style={{ width: '140px' }}>Created At</th>
                <th style={{ width: '220px' }} className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No quizzes found.
                  </td>
                </tr>
              ) : (
                filtered.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>{quiz.id}</td>
                    <td className="fw-semibold">{quiz.title}</td>
                    <td className="text-muted">{quiz.description}</td>
                    <td>{quiz.duration} min</td>
                    <td>{quiz.facultyName || '—'}</td>
                    <td className="text-muted">{formatDate(quiz.createdAt)}</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => setDetailsQuiz(quiz)}
                        >
                          View
                        </button>
                        <Link
                          className="btn btn-outline-primary"
                          to={`/admin/quizzes/edit/${quiz.id}`}
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(quiz)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiz details modal (Bootstrap markup, controlled by React state).
          Shows quiz-level info only — no questions. */}
      {detailsQuiz && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{detailsQuiz.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDetailsQuiz(null)}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Description</dt>
                    <dd className="col-sm-8">{detailsQuiz.description}</dd>

                    <dt className="col-sm-4">Duration</dt>
                    <dd className="col-sm-8">{detailsQuiz.duration} minutes</dd>

                    <dt className="col-sm-4">Created By</dt>
                    <dd className="col-sm-8">{detailsQuiz.facultyName || '—'}</dd>

                    <dt className="col-sm-4">Created At</dt>
                    <dd className="col-sm-8">{formatDate(detailsQuiz.createdAt)}</dd>

                    <dt className="col-sm-4">Quiz ID</dt>
                    <dd className="col-sm-8 text-muted">{detailsQuiz.id}</dd>
                  </dl>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const id = detailsQuiz.id;
                      setDetailsQuiz(null);
                      navigate(`/admin/quizzes/${id}`);
                    }}
                  >
                    Open Details Page
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setDetailsQuiz(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}
