import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import { fetchAvailableQuizzes } from "../../services/studentService.js";

const DIFFICULTY_CLASS = {
  Easy: "difficulty-Easy",
  Medium: "difficulty-Medium",
  Hard: "difficulty-Hard",
};

function AvailableQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetchAvailableQuizzes();
      if (!active) return;
      setQuizzes(data);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Existing search logic preserved.
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return quizzes;
    return quizzes.filter(
      (q) =>
        q.title.toLowerCase().includes(term) ||
        q.description.toLowerCase().includes(term)
    );
  }, [quizzes, search]);

  return (
    <StudentLayout>
      {/* Page header */}
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
        <div>
          <h3 className="fw-bold mb-1">Available Quizzes</h3>
          <p className="text-muted mb-0">
            Choose a quiz and test your knowledge.
          </p>
        </div>
        <div className="input-group" style={{ maxWidth: "320px" }}>
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="alert alert-info">No quizzes match your search.</div>
      ) : (
        <div className="row g-4">
          {filtered.map((quiz) => (
            <div className="col-md-6 col-xl-4" key={quiz.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold mb-0">{quiz.title}</h5>
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
                  <p className="card-text text-muted flex-grow-1">
                    {quiz.description}
                  </p>
                  <div className="d-flex justify-content-between quiz-meta mb-2">
                    <span>
                      <i className="bi bi-question-circle me-1"></i>
                      {quiz.questionCount} Questions
                    </span>
                    <span>
                      <i className="bi bi-clock me-1"></i>
                      {quiz.duration} Minutes
                    </span>
                  </div>
                  <div className="quiz-meta mb-3">
                    Difficulty:{" "}
                    <span className="fw-semibold">
                      {quiz.difficulty || "—"}
                    </span>
                  </div>
                  <Link
                    to={`/student/quizzes/${quiz.id}`}
                    className="btn btn-primary w-100 mt-auto"
                  >
                    Start Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
}

export default AvailableQuizzes;
