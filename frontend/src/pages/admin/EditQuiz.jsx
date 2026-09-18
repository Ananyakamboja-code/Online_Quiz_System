import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import QuizForm from '../../components/admin/QuizForm';
import { findQuiz, editQuiz } from '../../data/quizStore';

/**
 * Edit Quiz page.
 *
 * Reads the quiz id from the route, prefills the reusable QuizForm, and saves
 * back to the in-memory quizStore (mock-backed). Replace with
 * quizService.getQuizById + updateQuiz when the backend is ready.
 */
export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(undefined); // undefined = loading

  useEffect(() => {
    setQuiz(findQuiz(id));
  }, [id]);

  if (quiz === undefined) {
    return <p className="text-muted">Loading...</p>;
  }

  if (quiz === null) {
    return (
      <div>
        <h1 className="h3 mb-3">Edit Quiz</h1>
        <div className="alert alert-warning">
          Quiz not found.{' '}
          <Link to="/admin/quizzes" className="alert-link">
            Back to Quiz Management
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (values) => {
    editQuiz(id, values);
    navigate('/admin/quizzes');
  };

  return (
    <div>
      <h1 className="h3 mb-1">Edit Quiz</h1>
      <p className="text-muted">Update quiz details.</p>

      <div className="card shadow-sm">
        <div className="card-body">
          <QuizForm
            initialValues={{
              title: quiz.title,
              description: quiz.description,
              duration: quiz.duration,
              facultyId: quiz.facultyId || '',
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/admin/quizzes')}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}
