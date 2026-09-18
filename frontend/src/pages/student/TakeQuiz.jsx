import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import QuizTimer from "../../components/student/QuizTimer.jsx";
import {
  fetchQuizById,
  fetchQuizQuestions,
  submitQuizAttempt,
} from "../../services/studentService.js";

const OPTION_KEYS = ["A", "B", "C", "D"];

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // answers: { [questionId]: "A"|"B"|"C"|"D" }
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const [q, qs] = await Promise.all([
        fetchQuizById(id),
        fetchQuizQuestions(id),
      ]);
      if (!active) return;
      setQuiz(q);
      setQuestions(qs);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  const selectAnswer = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const goTo = (index) => {
    if (index >= 0 && index < questions.length) setCurrentIndex(index);
  };

  // Perform the actual (mock) submission and navigate to the result page.
  const doSubmit = useCallback(
    async (auto = false) => {
      if (submitting) return;
      setSubmitting(true);
      const result = await submitQuizAttempt(id, answers);
      navigate(`/student/quizzes/${id}/result`, {
        state: {
          result,
          quizTitle: quiz?.title,
          autoSubmitted: auto,
        },
        replace: true,
      });
    },
    [submitting, id, answers, navigate, quiz]
  );

  // Auto-submit when the timer runs out.
  const handleTimeUp = useCallback(() => {
    doSubmit(true);
  }, [doSubmit]);

  if (loading) {
    return (
      <StudentLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </StudentLayout>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <StudentLayout>
        <div className="alert alert-warning">
          This quiz has no questions available.{" "}
          <Link to="/student/quizzes">Back to available quizzes</Link>
        </div>
      </StudentLayout>
    );
  }

  const progressPercent = Math.round(
    ((currentIndex + 1) / questions.length) * 100
  );

  return (
    <StudentLayout>
      {/* Top bar: title, progress, timer */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h4 className="fw-bold mb-0">{quiz.title}</h4>
            <div className="d-flex align-items-center gap-3">
              <span className="badge bg-light text-dark border">
                Answered {answeredCount}/{questions.length}
              </span>
              <div className="fs-4">
                <QuizTimer
                  durationMinutes={quiz.duration}
                  onTimeUp={handleTimeUp}
                />
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="progress" style={{ height: "8px" }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${progressPercent}%` }}
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Question area */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="text-muted mb-2">
                Question {currentIndex + 1} of {questions.length}
              </div>

              <h5 className="fw-semibold mb-4">
                {currentQuestion.question_text}
              </h5>

              <div>
                {OPTION_KEYS.map((key) => {
                  const optionText =
                    currentQuestion[`option_${key.toLowerCase()}`];
                  const selected = answers[currentQuestion.id] === key;
                  return (
                    <div
                      key={key}
                      className={
                        "option-label d-flex align-items-center gap-3 " +
                        (selected ? "selected" : "")
                      }
                      onClick={() => selectAnswer(currentQuestion.id, key)}
                    >
                      <input
                        type="radio"
                        className="form-check-input m-0"
                        name={`q-${currentQuestion.id}`}
                        checked={selected}
                        onChange={() =>
                          selectAnswer(currentQuestion.id, key)
                        }
                      />
                      <span className="option-key">{key}</span>
                      <span>{optionText}</span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => goTo(currentIndex - 1)}
                  disabled={currentIndex === 0}
                >
                  <i className="bi bi-arrow-left me-1"></i> Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => goTo(currentIndex + 1)}
                  >
                    Next <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => setShowConfirm(true)}
                  >
                    <i className="bi bi-check2-circle me-1"></i> Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question navigator / review */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Question Navigator</h6>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {questions.map((q, index) => {
                  const isAnswered = Boolean(answers[q.id]);
                  const isCurrent = index === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={
                        "question-palette-btn " +
                        (isAnswered ? "answered " : "") +
                        (isCurrent ? "current" : "")
                      }
                      onClick={() => goTo(index)}
                      title={isAnswered ? "Answered" : "Not answered"}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="small text-muted">
                <span className="badge bg-success me-1">&nbsp;</span> Answered
                &nbsp;·&nbsp;
                <span className="badge bg-light border text-dark me-1">
                  &nbsp;
                </span>{" "}
                Not answered
              </div>

              <hr />
              <button
                className="btn btn-success w-100"
                onClick={() => setShowConfirm(true)}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      {showConfirm && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Quiz?</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  You have answered{" "}
                  <strong>
                    {answeredCount} of {questions.length}
                  </strong>{" "}
                  questions.
                </p>
                {answeredCount < questions.length && (
                  <p className="text-danger mb-0">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    Some questions are unanswered. They will be marked as
                    incorrect.
                  </p>
                )}
                <p className="mb-0 mt-2">
                  Submission is final. Do you want to continue?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                >
                  Keep Working
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => doSubmit(false)}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Yes, Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}

export default TakeQuiz;
