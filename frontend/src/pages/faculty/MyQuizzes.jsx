import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import ConfirmModal from '../../components/faculty/ConfirmModal';
import { getMyQuizzes, getQuizById, updateQuiz, deleteQuiz as deleteQuizApi } from '../../services/facultyApi';

const statusBadge = (status) => {
  const map = { Active: 'success', Inactive: 'secondary', Draft: 'warning' };
  return <span className={`badge bg-${map[status] || 'secondary'}`}>{status}</span>;
};

export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* ── Expanded quiz questions state ─────────────────────── */
  const [expandedId, setExpandedId] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const [expandLoading, setExpandLoading] = useState(false);

  /* ── Load quizzes from API ─────────────────────────────── */
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getMyQuizzes();
      setQuizzes(data);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQuizzes(); }, []);

  /* ── Toggle expand quiz to show questions ───────────────── */
  const handleTitleClick = async (quiz) => {
    if (expandedId === quiz.id) {
      setExpandedId(null);
      setExpandedQuestions([]);
      return;
    }
    setExpandedId(quiz.id);
    setExpandLoading(true);
    try {
      const fullQuiz = await getQuizById(quiz.id);
      setExpandedQuestions(fullQuiz.questions || []);
    } catch (err) {
      setErrorMsg(err.message);
      setExpandedQuestions([]);
    } finally {
      setExpandLoading(false);
    }
  };

  /* ── Delete ────────────────────────────────────────────── */
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteQuizApi(deleteTarget.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      if (expandedId === deleteTarget.id) { setExpandedId(null); setExpandedQuestions([]); }
      setSuccessMsg(`Quiz "${deleteTarget.title}" deleted successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    }
    setDeleteTarget(null);
  };

  /* ── Edit ──────────────────────────────────────────────── */
  const handleEditClick = (quiz) => {
    setEditId(quiz.id);
    setEditForm({
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      numberOfQuestions: quiz.numberOfQuestions,
      status: quiz.status,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateQuiz(editId, editForm);
      setQuizzes((prev) => prev.map((q) => (q.id === editId ? { ...q, ...updated } : q)));
      setEditId(null);
      setEditForm({});
      setSuccessMsg('Quiz updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEditCancel = () => { setEditId(null); setEditForm({}); };

  return (
    <div className="faculty-layout d-flex flex-column min-vh-100">
      <FacultyHeader />
      <div className="d-flex flex-grow-1">
        <FacultySidebar />
        <main className="faculty-content flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">My Quizzes</h2>
              <p className="text-muted mb-0">Manage all quizzes you have created. Click a quiz title to see its questions.</p>
            </div>
            <Link to="/faculty/create-quiz" className="btn btn-primary">➕ Create New Quiz</Link>
          </div>

          {successMsg && <div className="alert alert-success alert-dismissible fade show">{successMsg}<button type="button" className="btn-close" onClick={() => setSuccessMsg('')} aria-label="Close"></button></div>}
          {errorMsg && <div className="alert alert-danger alert-dismissible fade show">{errorMsg}<button type="button" className="btn-close" onClick={() => setErrorMsg('')} aria-label="Close"></button></div>}

          {/* Edit Form */}
          {editId && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white"><h5 className="mb-0 fw-semibold">✏️ Edit Quiz</h5></div>
              <div className="card-body">
                <form onSubmit={handleEditSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="edit-title" className="form-label fw-semibold">Quiz Title</label>
                      <input type="text" className="form-control" id="edit-title" name="title" value={editForm.title} onChange={handleEditChange} required />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="edit-duration" className="form-label fw-semibold">Duration (min)</label>
                      <input type="number" className="form-control" id="edit-duration" name="duration" value={editForm.duration} onChange={handleEditChange} min="1" required />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="edit-status" className="form-label fw-semibold">Status</label>
                      <select className="form-select" id="edit-status" name="status" value={editForm.status} onChange={handleEditChange}>
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-9">
                      <label htmlFor="edit-description" className="form-label fw-semibold">Description</label>
                      <input type="text" className="form-control" id="edit-description" name="description" value={editForm.description} onChange={handleEditChange} required />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="edit-questions" className="form-label fw-semibold">Questions</label>
                      <input type="number" className="form-control" id="edit-questions" name="numberOfQuestions" value={editForm.numberOfQuestions} onChange={handleEditChange} min="1" required />
                    </div>
                  </div>
                  <div className="d-flex gap-3 mt-4">
                    <button type="submit" className="btn btn-primary px-4">💾 Save Changes</button>
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={handleEditCancel}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div><p className="mt-2 text-muted">Loading quizzes...</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th><th>Quiz Title</th><th>Description</th><th>Duration</th><th>Questions</th><th>Status</th><th>Created Date</th><th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.length === 0 ? (
                        <tr><td colSpan="8" className="text-center text-muted py-4">No quizzes found. Create your first quiz!</td></tr>
                      ) : (
                        quizzes.map((q, i) => (
                          <>
                            <tr key={q.id} className={editId === q.id ? 'table-warning' : ''}>
                              <td>{i + 1}</td>
                              <td>
                                <button
                                  className="btn btn-link p-0 fw-semibold text-decoration-none text-start d-flex align-items-center gap-1"
                                  onClick={() => handleTitleClick(q)}
                                  title="Click to view questions"
                                >
                                  <span style={{ fontSize: '0.75rem', transition: 'transform 0.2s', transform: expandedId === q.id ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                                  {q.title}
                                </button>
                              </td>
                              <td className="text-muted small" style={{ maxWidth: 220 }}>{q.description}</td>
                              <td>{q.duration} min</td>
                              <td>{q.numberOfQuestions}</td>
                              <td>{statusBadge(q.status)}</td>
                              <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div className="d-flex gap-1 justify-content-center flex-wrap">
                                  <button className="btn btn-sm btn-outline-warning" onClick={() => handleEditClick(q)}>✏️ Edit</button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(q)}>🗑️ Delete</button>
                                  <Link to="/faculty/questions" className="btn btn-sm btn-outline-primary">➕ Add Questions</Link>
                                </div>
                              </td>
                            </tr>
                            {/* Expanded questions row */}
                            {expandedId === q.id && (
                              <tr key={`${q.id}-questions`}>
                                <td colSpan="8" className="bg-white p-0">
                                  <div className="p-3" style={{ borderLeft: '4px solid #4e73df' }}>
                                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                      <span>📋</span> Questions in "{q.title}"
                                    </h6>
                                    {expandLoading ? (
                                      <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary"></div> Loading questions...</div>
                                    ) : expandedQuestions.length === 0 ? (
                                      <div className="text-muted text-center py-3">No questions added yet. <Link to="/faculty/questions" className="text-primary">Add questions →</Link></div>
                                    ) : (
                                      <div className="table-responsive">
                                        <table className="table table-sm table-bordered mb-0">
                                          <thead className="table-light">
                                            <tr>
                                              <th style={{ width: 40 }}>#</th>
                                              <th>Question</th>
                                              <th className="text-center" style={{ width: 140 }}>Option A</th>
                                              <th className="text-center" style={{ width: 140 }}>Option B</th>
                                              <th className="text-center" style={{ width: 140 }}>Option C</th>
                                              <th className="text-center" style={{ width: 140 }}>Option D</th>
                                              <th className="text-center" style={{ width: 70 }}>Answer</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {expandedQuestions.map((eq, j) => (
                                              <tr key={eq.id}>
                                                <td className="text-muted">{j + 1}</td>
                                                <td className="fw-medium">{eq.question}</td>
                                                <td className={`text-center ${eq.correctAnswer === 'A' ? 'table-success fw-bold' : ''}`}>{eq.optionA}</td>
                                                <td className={`text-center ${eq.correctAnswer === 'B' ? 'table-success fw-bold' : ''}`}>{eq.optionB}</td>
                                                <td className={`text-center ${eq.correctAnswer === 'C' ? 'table-success fw-bold' : ''}`}>{eq.optionC}</td>
                                                <td className={`text-center ${eq.correctAnswer === 'D' ? 'table-success fw-bold' : ''}`}>{eq.optionD}</td>
                                                <td className="text-center"><span className="badge bg-primary">{eq.correctAnswer}</span></td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal show={!!deleteTarget} title="Delete Quiz" message="Are you sure you want to delete this quiz?" itemName={deleteTarget?.title} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
