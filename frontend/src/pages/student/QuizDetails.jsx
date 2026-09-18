import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import { fetchQuizById } from "../../services/studentService.js";

const DIFFICULTY_CLASS = {
  Easy: "difficulty-Easy",
  Medium: "difficulty-Medium",
  Hard: "difficulty-Hard",
};

function InfoCard({ icon, label, value }) {
  return (
    <div className="col-sm-4">
      <div className="card border-0 bg-light h-100 text-center">
        <div className="card-body py-3">
          <div className="text-primary mb-1">
            <i className={`bi ${icon} fs-4`}></i>
          </div>
          <div className="text-muted small">{label}</div>
          <div className="h6 fw-bold mb-0">{value}</div>
        </div>
      </div>
    </div>
  );
}

function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetchQuizById(id);
      if (!active) return;
      setQuiz(data);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [id]);

  // Start logic unchanged.
  const handleStart = () => {
    navigate(`/student/quizzes/${id}/start`);
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </StudentLayout>
    );
  }

  if (!quiz) {
    return (
      <StudentLayout>
        <div className="alert alert-warning">
          Quiz not found.{" "}
          <Link to="/student/quizzes">Back to available quizzes</Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/student/quizzes">Available Quizzes</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {quiz.title}
          </li>
        </ol>
      </nav>

      {/* Quiz header */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
            <h3 className="fw-bold mb-0">{quiz.title}</h3>
            {quiz.difficulty && (
              <span
                className={`badge difficulty-badge ${
                  DIFFICULTY_CLASS[quiz.difficulty] || ""
                }`}
              >
                {quiz.difficulty}
              </span>
            )}
          </div>
          <p className="text-muted mb-4">{quiz.description}</p>

          {/* Quiz information cards */}
          <div className="row g-3">
            <InfoCard
              icon="bi-clock"
              label="Duration"
              value={`${quiz.duration} Minutes`}
            />
            <InfoCard
              icon="bi-question-circle"
              label="Questions"
              value={quiz.questionCount}
            />
            <InfoCard
              icon="bi-bar-chart"
              label="Difficulty"
              value={quiz.difficulty || "—"}
            />
          </div>
        </div>
      </div>

      {/* Instructions card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-3">
            <i className="bi bi-info-circle me-2 text-primary"></i>
            Instructions
          </h6>
          <ul className="text-muted mb-0">
            <li>Read each question carefully before answering.</li>
            <li>You can move between questions and change your answers.</li>
            <li>
              The quiz auto-submits when the timer reaches zero, so keep an eye
              on the clock.
            </li>
            <li>Click Submit when you are done. Submission is final.</li>
          </ul>
        </div>
      </div>

      {/* Confirmation + start (logic unchanged) */}
      {!confirming ? (
        <button
          className="btn btn-primary btn-lg"
          onClick={() => setConfirming(true)}
        >
          <i className="bi bi-play-fill me-1"></i>
          Start Quiz
        </button>
      ) : (
        <div className="alert alert-warning" role="alert">
          <p className="mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            You are about to start this quiz. Make sure you are ready before
            proceeding.
          </p>
          <button className="btn btn-success me-2" onClick={handleStart}>
            Yes, start now
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </StudentLayout>
  );
}

export default QuizDetails;
