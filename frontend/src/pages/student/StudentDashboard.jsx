import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import StudentProfileCard from "../../components/student/StudentProfileCard.jsx";
import {
  fetchCurrentStudent,
  fetchAvailableQuizzes,
  fetchResultsHistory,
  fetchStudentStats,
} from "../../services/studentService.js";

const DIFFICULTY_CLASS = {
  Easy: "difficulty-Easy",
  Medium: "difficulty-Medium",
  Hard: "difficulty-Hard",
};

function StatCard({ icon, iconClass, value, label }) {
  return (
    <div className="card stat-card shadow-sm h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <span className={`stat-icon ${iconClass}`}>
          <i className={`bi ${icon}`}></i>
        </span>
        <div>
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const [s, q, r, st] = await Promise.all([
        fetchCurrentStudent(),
        fetchAvailableQuizzes(),
        fetchResultsHistory(),
        fetchStudentStats(),
      ]);
      if (!active) return;
      setStudent(s);
      setQuizzes(q);
      setResults(r);
      setStats(st);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Most recent attempts first (derived, not hardcoded).
  const recent = useMemo(
    () =>
      [...results]
        .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
        .slice(0, 4),
    [results]
  );

  const firstName = student?.name?.split(" ")[0] || "Student";

  return (
    <StudentLayout student={student}>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <>
          {/* 1. Profile */}
          <div className="mb-4">
            <StudentProfileCard student={student} stats={stats} />
          </div>

          {/* 2. Welcome hero */}
          <div className="student-hero mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h3 className="fw-bold mb-1">Welcome back, {firstName}!</h3>
              <p className="mb-0 opacity-75">
                Ready to test your knowledge? Explore available quizzes and
                track your progress.
              </p>
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
              <Link to="/student/quizzes" className="btn btn-light">
                <i className="bi bi-journal-text me-1"></i>
                Explore Quizzes
              </Link>
              <Link to="/student/results" className="btn btn-outline-light">
                View My Results
              </Link>
            </div>
          </div>

          {/* 3. Statistics (all calculated) */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-lg">
              <StatCard
                icon="bi-collection"
                iconClass="bg-soft-primary"
                value={stats.totalQuizzes}
                label="Total Quizzes"
              />
            </div>
            <div className="col-6 col-lg">
              <StatCard
                icon="bi-pencil-square"
                iconClass="bg-soft-info"
                value={stats.attempted}
                label="Attempted"
              />
            </div>
            <div className="col-6 col-lg">
              <StatCard
                icon="bi-check2-circle"
                iconClass="bg-soft-success"
                value={stats.completed}
                label="Completed"
              />
            </div>
            <div className="col-6 col-lg">
              <StatCard
                icon="bi-graph-up"
                iconClass="bg-soft-warning"
                value={`${stats.averagePercentage}%`}
                label="Average Score"
              />
            </div>
            <div className="col-12 col-lg">
              <StatCard
                icon="bi-trophy"
                iconClass="bg-soft-danger"
                value={`${stats.highestPercentage}%`}
                label="Best Score"
              />
            </div>
          </div>

          <div className="row g-4">
            {/* 4. Available quizzes */}
            <div className="col-lg-7">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold mb-0">Available Quizzes</h5>
                <Link to="/student/quizzes" className="small">
                  See all
                </Link>
              </div>
              <div className="row g-3">
                {quizzes.slice(0, 4).map((quiz) => (
                  <div className="col-sm-6" key={quiz.id}>
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="fw-bold mb-0">{quiz.title}</h6>
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
                        <div className="quiz-meta mb-3">
                          <i className="bi bi-question-circle me-1"></i>
                          {quiz.questionCount} Questions
                          <span className="mx-2">·</span>
                          <i className="bi bi-clock me-1"></i>
                          {quiz.duration} Minutes
                        </div>
                        <Link
                          to={`/student/quizzes/${quiz.id}`}
                          className="btn btn-sm btn-primary mt-auto"
                        >
                          Start Quiz
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Recent results */}
            <div className="col-lg-5">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold mb-0">Recent Results</h5>
                <Link to="/student/results" className="small">
                  View All Results
                </Link>
              </div>
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Quiz</th>
                        <th className="text-center">Score</th>
                        <th className="text-center">%</th>
                        <th className="text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-muted text-center">
                            No completed quizzes yet.
                          </td>
                        </tr>
                      )}
                      {recent.map((r) => (
                        <tr key={r.id}>
                          <td>
                            <div className="fw-semibold">{r.quizTitle}</div>
                            <small className="text-muted">
                              {new Date(r.submitted_at).toLocaleDateString(
                                undefined,
                                { day: "2-digit", month: "short", year: "numeric" }
                              )}
                            </small>
                          </td>
                          <td className="text-center">
                            {r.score}/{r.total_questions}
                          </td>
                          <td className="text-center">
                            <span
                              className={
                                "badge " +
                                (r.percentage >= 50 ? "bg-success" : "bg-danger")
                              }
                            >
                              {r.percentage}%
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-secondary-subtle text-secondary-emphasis">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. Quick actions */}
              <div className="d-flex gap-2 mt-3">
                <Link
                  to="/student/quizzes"
                  className="btn btn-outline-primary btn-sm flex-fill"
                >
                  <i className="bi bi-journal-text me-1"></i> Quizzes
                </Link>
                <Link
                  to="/student/results"
                  className="btn btn-outline-primary btn-sm flex-fill"
                >
                  <i className="bi bi-bar-chart-line me-1"></i> Results
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </StudentLayout>
  );
}

export default StudentDashboard;
