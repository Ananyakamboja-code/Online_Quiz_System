import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getQuizById } from '../../services/quizService';
import { formatDate } from '../../utils/format';

/**
 * Quiz Details (Admin) — read-only view of a single quiz.
 *
 * Shows quiz-level information only: title, description, duration, created by
 * (faculty), and created date. Questions are intentionally NOT shown or
 * managed here — that is the Faculty module's responsibility.
 */
export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    getQuizById(id)
      .then(setQuiz)
      .catch(() => setQuiz(null));
  }, [id]);

  if (quiz === undefined) {
    return <p className="text-muted">Loading...</p>;
  }

  if (quiz === null) {
    return (
      <div>
        <h1 className="h3 mb-3">Quiz Details</h1>
        <div className="alert alert-warning">
          Quiz not found.{' '}
          <Link to="/admin/quizzes" className="alert-link">
            Back to Quiz Management
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-2">
          <li className="breadcrumb-item">
            <Link to="/admin/quizzes">Quiz Management</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Details
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h1 className="h3 mb-0">{quiz.title}</h1>
        <Link to={`/admin/quizzes/edit/${quiz.id}`} className="btn btn-outline-primary">
          Edit Quiz
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="h6 text-muted mb-3">Quiz Details</h2>
          <dl className="row mb-0">
            <dt className="col-sm-3">Title</dt>
            <dd className="col-sm-9">{quiz.title}</dd>

            <dt className="col-sm-3">Description</dt>
            <dd className="col-sm-9">{quiz.description}</dd>

            <dt className="col-sm-3">Duration</dt>
            <dd className="col-sm-9">{quiz.duration} minutes</dd>

            <dt className="col-sm-3">Created By</dt>
            <dd className="col-sm-9">{quiz.facultyName || '—'}</dd>

            <dt className="col-sm-3">Created At</dt>
            <dd className="col-sm-9">{formatDate(quiz.createdAt)}</dd>
          </dl>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-link mt-3 px-0"
        onClick={() => navigate('/admin/quizzes')}
      >
        &larr; Back to Quiz Management
      </button>
    </div>
  );
}
