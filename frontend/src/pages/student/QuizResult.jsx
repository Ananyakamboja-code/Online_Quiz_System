import { useLocation, useParams, Link } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout.jsx";

/**
 * Shows the result of a just-completed quiz attempt.
 *
 * The result is passed via router state from TakeQuiz. If a user lands here
 * directly (e.g. refresh), there is no state, so we show a friendly fallback.
 */
function DetailRow({ label, value, valueClass = "" }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
      <span className="text-muted">{label}</span>
      <span className={`fw-semibold ${valueClass}`}>{value}</span>
    </li>
  );
}

function QuizResult() {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state || {};
  const { result, quizTitle, autoSubmitted } = state;

  if (!result) {
    return (
      <StudentLayout>
        <div className="alert alert-info">
          <p>No recent result to display for this quiz.</p>
          <div className="d-flex gap-2">
            <Link to="/student/results" className="btn btn-primary btn-sm">
              View Results History
            </Link>
            <Link
              to={`/student/quizzes/${id}`}
              className="btn btn-outline-secondary btn-sm"
            >
              Back to Quiz
            </Link>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // Prefer values from the result payload; fall back to derived values so this
  // page still works with older result objects.
  const correct = result.correct ?? result.score;
  const incorrect =
    result.incorrect ?? result.total_questions - result.score;
  const unanswered = result.unanswered ?? 0;
  const passed = result.percentage >= 50;

  const submittedDate = new Date(result.submitted_at);
  const submittedText = submittedDate.toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <StudentLayout>
      {/* Header */}
      <div className="text-center mb-4">
        <div
          className={
            "display-6 mb-2 " + (passed ? "text-success" : "text-danger")
          }
        >
          <i
            className={
              "bi " + (passed ? "bi-check-circle-fill" : "bi-x-circle-fill")
            }
          ></i>
        </div>
        <h3 className="fw-bold mb-1">Quiz Completed</h3>
        <p className="text-muted mb-2">{quizTitle || "Quiz"}</p>
        {autoSubmitted && (
          <p className="text-warning mb-0">
            <i className="bi bi-clock-history me-1"></i>
            Time expired — your quiz was submitted automatically.
          </p>
        )}
      </div>

      <div className="row g-4">
        {/* Main score card */}
        <div className="col-lg-5">
          <div className="card result-hero border-0 shadow-sm h-100">
            <div className="card-body text-center d-flex flex-column justify-content-center p-4">
              <div className="text-muted small text-uppercase mb-1">Score</div>
              <div className="score-highlight mb-2">
                {result.score}
                <span className="fs-4 text-muted"> / {result.total_questions}</span>
              </div>

              <div className="text-muted small text-uppercase mb-1">
                Percentage
              </div>
              <div className="h2 fw-bold mb-3">{result.percentage}%</div>

              <div className="progress mb-3" style={{ height: "12px" }}>
                <div
                  className={
                    "progress-bar " + (passed ? "bg-success" : "bg-danger")
                  }
                  role="progressbar"
                  style={{ width: `${result.percentage}%` }}
                  aria-valuenow={result.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>

              <span
                className={
                  "badge fs-6 align-self-center " +
                  (passed ? "bg-success" : "bg-danger")
                }
              >
                {passed ? "Passed" : "Needs Improvement"}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed statistics + submission info */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Detailed Statistics</h6>
              <ul className="list-group list-group-flush">
                <DetailRow label="Total Questions" value={result.total_questions} />
                <DetailRow
                  label="Correct Answers"
                  value={correct}
                  valueClass="text-success"
                />
                <DetailRow
                  label="Incorrect Answers"
                  value={incorrect}
                  valueClass="text-danger"
                />
                <DetailRow label="Unanswered" value={unanswered} />
                <DetailRow label="Percentage" value={`${result.percentage}%`} />
                <DetailRow label="Status" value="Submitted" />
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-2">Submission Information</h6>
              <div className="text-muted small">Submitted On</div>
              <div className="fw-semibold">
                <i className="bi bi-calendar-check me-1"></i>
                {submittedText}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-question breakdown (available from mock scoring) */}
      {Array.isArray(result.breakdown) && result.breakdown.length > 0 && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">Answer Breakdown</h6>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>#</th>
                    <th>Question</th>
                    <th className="text-center">Your Answer</th>
                    <th className="text-center">Correct</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((b, i) => (
                    <tr key={b.questionId}>
                      <td>{i + 1}</td>
                      <td>{b.questionText}</td>
                      <td className="text-center">{b.selected || "—"}</td>
                      <td className="text-center">{b.correct}</td>
                      <td className="text-center">
                        {b.isCorrect ? (
                          <span className="badge bg-success">Correct</span>
                        ) : (
                          <span className="badge bg-danger">Incorrect</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="d-flex flex-wrap gap-2 mt-4">
        <Link to="/student/results" className="btn btn-primary">
          <i className="bi bi-bar-chart-line me-1"></i>
          View Results History
        </Link>
        <Link to="/student/quizzes" className="btn btn-outline-primary">
          <i className="bi bi-journal-text me-1"></i>
          Available Quizzes
        </Link>
        <Link to="/student" className="btn btn-outline-secondary">
          <i className="bi bi-speedometer2 me-1"></i>
          Student Dashboard
        </Link>
      </div>
    </StudentLayout>
  );
}

export default QuizResult;
