import { useState } from 'react';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import ConfirmModal from '../../components/faculty/ConfirmModal';

/* ── Dummy data ─────────────────────────────────────────── */
const QUIZ_LIST = [
  { id: 1, title: 'Data Structures Mid-Term' },
  { id: 2, title: 'OOP Concepts Quiz' },
  { id: 3, title: 'Database Fundamentals' },
  { id: 4, title: 'Web Development Basics' },
  { id: 5, title: 'Algorithms Final' },
];

const INITIAL_QUESTIONS = [
  { id: 1, quizId: 1, question: 'Which data structure uses LIFO?',           optA: 'Queue',     optB: 'Stack',     optC: 'Array',      optD: 'Tree',       correct: 'B' },
  { id: 2, quizId: 1, question: 'Time complexity of binary search?',         optA: 'O(n)',      optB: 'O(n²)',     optC: 'O(log n)',   optD: 'O(1)',       correct: 'C' },
  { id: 3, quizId: 2, question: 'Which keyword is used for inheritance?',    optA: 'implements',optB: 'extends',   optC: 'inherits',   optD: 'super',      correct: 'B' },
  { id: 4, quizId: 2, question: 'What is polymorphism?',                     optA: 'One form',  optB: 'Many forms',optC: 'No form',    optD: 'Two forms',  correct: 'B' },
  { id: 5, quizId: 3, question: 'What does SQL stand for?',                  optA: 'Structured Query Language', optB: 'Simple Query Language', optC: 'Standard Query Language', optD: 'Sequential Query Language', correct: 'A' },
];

const EMPTY_FORM = { quizId: '', question: '', optA: '', optB: '', optC: '', optD: '', correct: '' };

/* ── Component ──────────────────────────────────────────── */
export default function Questions() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  /* ── Delete modal state ────────────────────────────────── */
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteClick = (q) => setDeleteTarget(q);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setQuestions((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      setSuccessMsg('Question deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
    setDeleteTarget(null);
  };

  const handleDeleteCancel = () => setDeleteTarget(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setQuestions((prev) =>
        prev.map((q) => (q.id === editId ? { ...form, id: editId, quizId: Number(form.quizId) } : q))
      );
      setSuccessMsg('Question updated successfully!');
      setEditId(null);
    } else {
      const newQ = { ...form, id: Date.now(), quizId: Number(form.quizId) };
      setQuestions((prev) => [...prev, newQ]);
      setSuccessMsg('Question added successfully!');
    }
    setForm(EMPTY_FORM);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setForm({ quizId: String(q.quizId), question: q.question, optA: q.optA, optB: q.optB, optC: q.optC, optD: q.optD, correct: q.correct });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Filter questions by selected quiz */
  const filtered = selectedQuiz
    ? questions.filter((q) => q.quizId === Number(selectedQuiz))
    : questions;

  return (
    <div className="faculty-layout d-flex flex-column min-vh-100">
      <FacultyHeader />
      <div className="d-flex flex-grow-1">
        <FacultySidebar />
        <main className="faculty-content flex-grow-1 p-4 bg-light">
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Questions Management</h2>
            <p className="text-muted">Add, edit, or delete MCQ questions for your quizzes.</p>
          </div>

          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMsg}
              <button type="button" className="btn-close" onClick={() => setSuccessMsg('')} aria-label="Close"></button>
            </div>
          )}

          {/* Add / Edit form */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0 fw-semibold">{editId ? '✏️ Edit Question' : '➕ Add New Question'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="quizId" className="form-label fw-semibold">Select Quiz</label>
                    <select className="form-select" id="quizId" name="quizId" value={form.quizId} onChange={handleChange} required>
                      <option value="">-- Choose a Quiz --</option>
                      {QUIZ_LIST.map((q) => (
                        <option key={q.id} value={q.id}>{q.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="correct" className="form-label fw-semibold">Correct Answer</label>
                    <select className="form-select" id="correct" name="correct" value={form.correct} onChange={handleChange} required>
                      <option value="">-- Select --</option>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="question" className="form-label fw-semibold">Question</label>
                    <textarea className="form-control" id="question" name="question" rows="2"
                      placeholder="Enter your question" value={form.question} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="optA" className="form-label fw-semibold">Option A</label>
                    <input type="text" className="form-control" id="optA" name="optA"
                      placeholder="Option A" value={form.optA} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="optB" className="form-label fw-semibold">Option B</label>
                    <input type="text" className="form-control" id="optB" name="optB"
                      placeholder="Option B" value={form.optB} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="optC" className="form-label fw-semibold">Option C</label>
                    <input type="text" className="form-control" id="optC" name="optC"
                      placeholder="Option C" value={form.optC} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="optD" className="form-label fw-semibold">Option D</label>
                    <input type="text" className="form-control" id="optD" name="optD"
                      placeholder="Option D" value={form.optD} onChange={handleChange} required />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-4">
                  <button type="submit" className="btn btn-primary px-4">
                    {editId ? '💾 Update Question' : '➕ Add Question'}
                  </button>
                  {editId && (
                    <button type="button" className="btn btn-outline-secondary px-4"
                      onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Filter + table */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0 fw-semibold">Questions List</h5>
              <select className="form-select form-select-sm" style={{ maxWidth: 260 }}
                value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)}>
                <option value="">All Quizzes</option>
                {QUIZ_LIST.map((q) => (
                  <option key={q.id} value={q.id}>{q.title}</option>
                ))}
              </select>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Question</th>
                      <th>Option A</th>
                      <th>Option B</th>
                      <th>Option C</th>
                      <th>Option D</th>
                      <th>Answer</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan="8" className="text-center text-muted py-4">No questions found.</td></tr>
                    ) : (
                      filtered.map((q, i) => (
                        <tr key={q.id}>
                          <td>{i + 1}</td>
                          <td className="fw-medium" style={{ minWidth: 200 }}>{q.question}</td>
                          <td>{q.optA}</td>
                          <td>{q.optB}</td>
                          <td>{q.optC}</td>
                          <td>{q.optD}</td>
                          <td><span className="badge bg-primary">{q.correct}</span></td>
                          <td>
                            <div className="d-flex gap-1 justify-content-center">
                              <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(q)}>✏️ Edit</button>
                              <button className="btn btn-sm btn-outline-danger"  onClick={() => handleDeleteClick(q)}>🗑️ Delete</button>
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
        title="Delete Question"
        message="Are you sure you want to delete this question?"
        itemName={deleteTarget?.question}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
