import { useNavigate } from 'react-router-dom';
import QuizForm from '../../components/admin/QuizForm';
import { addQuiz } from '../../data/quizStore';

/**
 * Create Quiz page.
 *
 * Uses the reusable QuizForm. On submit, writes to the in-memory quizStore
 * (mock-backed) and returns to the quiz list. Replace addQuiz with the
 * quizService.createQuiz Axios call when the backend is ready.
 */
export default function CreateQuiz() {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    addQuiz(values);
    navigate('/admin/quizzes');
  };

  return (
    <div>
      <h1 className="h3 mb-1">Create Quiz</h1>
      <p className="text-muted">Add a new quiz to the system.</p>

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
