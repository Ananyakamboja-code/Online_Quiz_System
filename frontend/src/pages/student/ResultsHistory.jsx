import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import {
  fetchResultsHistory,
  fetchStudentStats,
} from "../../services/studentService.js";

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "score_desc", label: "Highest %" },
  { value: "score_asc", label: "Lowest %" },
];

function SummaryCard({ icon, iconClass, value, label }) {
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

function ResultsHistory() {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  useEffect(() => {
    let active = true;
    (async () => {
      const [data, st] = await Promise.all([
        fetchResultsHistory(),
        fetchStudentStats(),
      ]);
      if (!active) return;
      setResults(data);
      setStats(st);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Existing search + sort logic preserved.
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = results.filter((r) =>
      r.quizTitle.toLowerCase().includes(term)
    );

    switch (sortBy) {
      case "date_asc":
        list = list.sort(
          (a, b) => new Date(a.submitted_at) - new Date(b.submitted_at)
        );
        break;
      case "score_desc":
        list = list.sort((a, b) => b.percentage - a.percentage);
        break;
      case "score_asc":
        list = list.sort((a, b) => a.percentage - b.percentage);
        break;
      case "date_desc":
      default:
        list = list.sort(
          (a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)
        );
        break;
    }
    return list;
  }, [results, search, sortBy]);

  return (
    <StudentLayout>
      {/* Page header */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">My Quiz Results</h3>
        <p className="text-muted mb-0">
          Track your performance across all completed quizzes.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <>
          {/* Summary cards (calculated) */}
          {stats && (
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <SummaryCard
                  icon="bi-list-check"
                  iconClass="bg-soft-primary"
                  value={stats.totalAttempts}
                  label="Total Attempts"
                />
              </div>
              <div className="col-6 col-lg-3">
                <SummaryCard
                  icon="bi-graph-up"
                  iconClass="bg-soft-warning"
                  value={`${stats.averagePercentage}%`}
                  label="Average Score"
                />
              </div>
              <div className="col-6 col-lg-3">
                <SummaryCard
                  icon="bi-trophy"
                  iconClass="bg-soft-success"
                  value={`${stats.highestPercentage}%`}
                  label="Highest Score"
                />
              </div>
              <div className="col-6 col-lg-3">
                <SummaryCard
                  icon="bi-question-circle"
                  iconClass="bg-soft-info"
                  value={stats.totalQuestionsAnswered}
                  label="Questions Answered"
                />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="d-flex flex-wrap justify-content-end gap-2 mb-3">
            <div className="input-group" style={{ maxWidth: "260px" }}>
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by quiz..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select"
              style={{ maxWidth: "180px" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {visible.length === 0 ? (
            <div className="alert alert-info">
              No results found.{" "}
              <Link to="/student/quizzes">Take a quiz</Link> to get started.
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Quiz</th>
                      <th className="text-center">Score</th>
                      <th className="text-center">Correct</th>
                      <th className="text-center">Incorrect</th>
                      <th style={{ minWidth: "150px" }}>Percentage</th>
                      <th>Submitted On</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((r) => (
                      <tr key={r.id}>
                        <td className="fw-semibold">{r.quizTitle}</td>
                        <td className="text-center">
                          {r.score} / {r.total_questions}
                        </td>
                        <td className="text-center text-success fw-semibold">
                          {r.correct}
                        </td>
                        <td className="text-center text-danger fw-semibold">
                          {r.incorrect}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="progress flex-grow-1"
                              style={{ height: "8px", minWidth: "70px" }}
                            >
                              <div
                                className={
                                  "progress-bar " +
                                  (r.percentage >= 50 ? "bg-success" : "bg-danger")
                                }
                                role="progressbar"
                                style={{ width: `${r.percentage}%` }}
                                aria-valuenow={r.percentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                            <span className="small fw-semibold">
                              {r.percentage}%
                            </span>
                          </div>
                        </td>
                        <td>
                          {new Date(r.submitted_at).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
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
          )}
        </>
      )}
    </StudentLayout>
  );
}

export default ResultsHistory;
