import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import QuizForm from '../../components/admin/QuizForm';
import { getQuizById, updateQuiz } from '../../services/quizService';

/**
 * Edit Quiz page.
 *
 * Loads the quiz from the backend, prefills the reusable QuizForm, and saves
 * changes via quizService.
 */
export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(undefined); // undefined = loading, null = not found
  const [error, setError] = useState('');

  useEffect(() => {
    getQuizById(id)
      .then(setQuiz)
      .catch((e) => {
        if (e?.response?.status === 404) setQuiz(null);
        else setError(e?.response?.data?.message || 'Failed to load quiz.');
      });
  }, [id]);

  if (error) {
    return (
      <div>
        <h1 className="h3 mb-3">Edit Quiz</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

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

  const handleSubmit = async (values) => {
    setError('');
    try {
      await updateQuiz(id, values);
      navigate('/admin/quizzes');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update quiz.');
    }
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
