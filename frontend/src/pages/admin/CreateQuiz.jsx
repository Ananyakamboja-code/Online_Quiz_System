import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizForm from '../../components/admin/QuizForm';
import { createQuiz } from '../../services/quizService';

/**
 * Create Quiz page.
 *
 * Uses the reusable QuizForm and posts to the backend via quizService.
 */
export default function CreateQuiz() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setError('');
    try {
      await createQuiz(values);
      navigate('/admin/quizzes');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create quiz.');
    }
  };

  return (
    <div>
      <h1 className="h3 mb-1">Create Quiz</h1>
      <p className="text-muted">Add a new quiz to the system.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <QuizForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/admin/quizzes')}
            submitLabel="Create Quiz"
          />
        </div>
      </div>
    </div>
  );
}
