import { useState } from 'react';
import { Link } from 'react-router-dom';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import ConfirmModal from '../../components/faculty/ConfirmModal';

/* ── Dummy quiz data ───────────────────────────────────── */
const INITIAL_QUIZZES = [
  { id: 1, title: 'Data Structures Mid-Term',  description: 'Covers arrays, linked lists, stacks, queues', duration: 45, questions: 25, status: 'Active',   createdDate: '2026-09-10' },
  { id: 2, title: 'OOP Concepts Quiz',         description: 'Inheritance, polymorphism, abstraction',     duration: 30, questions: 20, status: 'Active',   createdDate: '2026-09-08' },
  { id: 3, title: 'Database Fundamentals',      description: 'SQL, normalization, ER diagrams',            duration: 60, questions: 30, status: 'Inactive', createdDate: '2026-09-01' },
  { id: 4, title: 'Web Development Basics',     description: 'HTML, CSS, JavaScript fundamentals',         duration: 40, questions: 15, status: 'Draft',    createdDate: '2026-08-28' },
  { id: 5, title: 'Algorithms Final',           description: 'Sorting, searching, graph algorithms',       duration: 90, questions: 40, status: 'Active',   createdDate: '2026-08-25' },
  { id: 6, title: 'Computer Networks Quiz',     description: 'OSI model, TCP/IP, routing protocols',       duration: 35, questions: 20, status: 'Draft',    createdDate: '2026-08-20' },
];

/* ── Helpers ─────────────────────────────────────────────── */
const statusBadge = (status) => {
  const map = { Active: 'success', Inactive: 'secondary', Draft: 'warning' };
  return <span className={`badge bg-${map[status] || 'secondary'}`}>{status}</span>;
};

/* ── Component ──────────────────────────────────────────── */
export default function MyQuizzes() {
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [viewQuiz, setViewQuiz] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  /* ── Delete modal state ────────────────────────────────── */
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteClick = (quiz) => setDeleteTarget(quiz);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setQuizzes((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      setSuccessMsg(`Quiz "${deleteTarget.title}" deleted successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
    setDeleteTarget(null);
  };

  const handleDeleteCancel = () => setDeleteTarget(null);

  /* ── Edit handlers ─────────────────────────────────────── */
  const handleEditClick = (quiz) => {
    setEditId(quiz.id);
    setEditForm({
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      questions: quiz.questions,
      status: quiz.status,
    });
    setViewQuiz(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === editId
          ? { ...q, title: editForm.title, description: editForm.description, duration: Number(editForm.duration), questions: Number(editForm.questions), status: editForm.status }
          : q
      )
    );
    setEditId(null);
    setEditForm({});
    setSuccessMsg('Quiz updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({});
  };

  return (
    <div className="faculty-layout d-flex flex-column min-vh-100">
      <FacultyHeader />
      <div className="d-flex flex-grow-1">
        <FacultySidebar />
        <main className="faculty-content flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">My Quizzes</h2>
              <p className="text-muted mb-0">Manage all quizzes you have created.</p>
            </div>
            <Link to="/faculty/create-quiz" className="btn btn-primary">➕ Create New Quiz</Link>
          </div>

          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMsg}
              <button type="button" className="btn-close" onClick={() => setSuccessMsg('')} aria-label="Close"></button>
            </div>
          )}

          {/* Inline Edit Form */}
          {editId && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white">
                <h5 className="mb-0 fw-semibold">✏️ Edit Quiz</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleEditSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="edit-title" className="form-label fw-semibold">Quiz Title</label>
                      <input type="text" className="form-control" id="edit-title" name="title"
                        value={editForm.title} onChange={handleEditChange} required />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="edit-duration" className="form-label fw-semibold">Duration (min)</label>
                      <input type="number" className="form-control" id="edit-duration" name="duration"
                        value={editForm.duration} onChange={handleEditChange} min="1" required />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="edit-status" className="form-label fw-semibold">Status</label>
                      <select className="form-select" id="edit-status" name="status"
                        value={editForm.status} onChange={handleEditChange}>
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-9">
                      <label htmlFor="edit-description" className="form-label fw-semibold">Description</label>
                      <input type="text" className="form-control" id="edit-description" name="description"
                        value={editForm.description} onChange={handleEditChange} required />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="edit-questions" className="form-label fw-semibold">Questions</label>
                      <input type="number" className="form-control" id="edit-questions" name="questions"
                        value={editForm.questions} onChange={handleEditChange} min="1" required />
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

          {/* View details */}
          {viewQuiz && (
            <div className="alert alert-info alert-dismissible fade show" role="alert">
              <h5 className="alert-heading fw-bold">{viewQuiz.title}</h5>
              <p className="mb-1"><strong>Description:</strong> {viewQuiz.description}</p>
              <p className="mb-1"><strong>Duration:</strong> {viewQuiz.duration} min &nbsp;|&nbsp; <strong>Questions:</strong> {viewQuiz.questions}</p>
              <p className="mb-0"><strong>Status:</strong> {viewQuiz.status} &nbsp;|&nbsp; <strong>Created:</strong> {viewQuiz.createdDate}</p>
              <button type="button" className="btn-close" onClick={() => setViewQuiz(null)} aria-label="Close"></button>
            </div>
          )}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Quiz Title</th>
                      <th>Description</th>
                      <th>Duration</th>
                      <th>Questions</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.length === 0 ? (
                      <tr><td colSpan="8" className="text-center text-muted py-4">No quizzes found.</td></tr>
                    ) : (
                      quizzes.map((q, i) => (
                        <tr key={q.id} className={editId === q.id ? 'table-warning' : ''}>
                          <td>{i + 1}</td>
                          <td className="fw-medium">{q.title}</td>
                          <td className="text-muted small" style={{ maxWidth: 220 }}>{q.description}</td>
                          <td>{q.duration} min</td>
                          <td>{q.questions}</td>
                          <td>{statusBadge(q.status)}</td>
                          <td>{q.createdDate}</td>
                          <td>
                            <div className="d-flex gap-1 justify-content-center flex-wrap">
                              <button className="btn btn-sm btn-outline-info"    onClick={() => setViewQuiz(q)}>👁️ View</button>
                              <button className="btn btn-sm btn-outline-warning" onClick={() => handleEditClick(q)}>✏️ Edit</button>
                              <button className="btn btn-sm btn-outline-danger"  onClick={() => handleDeleteClick(q)}>🗑️ Delete</button>
                              <Link to="/faculty/questions" className="btn btn-sm btn-outline-primary">➕ Add Questions</Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz?"
        itemName={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
