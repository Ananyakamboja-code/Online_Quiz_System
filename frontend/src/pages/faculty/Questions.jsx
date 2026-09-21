import { useState, useEffect } from 'react';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import ConfirmModal from '../../components/faculty/ConfirmModal';
import { getMyQuizzes, getQuestions, addQuestion, updateQuestion, deleteQuestion as deleteQuestionApi } from '../../services/facultyApi';

const EMPTY_FORM = { quizId: '', question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '' };

export default function Questions() {
  const [quizList, setQuizList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /* Load quiz list for dropdown */
  useEffect(() => {
    getMyQuizzes()
      .then(setQuizList)
      .catch((err) => setErrorMsg(err.message));
  }, []);

  /* Load questions when quiz filter changes */
  useEffect(() => {
    if (!selectedQuiz) { setQuestions([]); return; }
    setLoading(true);
    getQuestions(selectedQuiz)
      .then((data) => { setQuestions(data); setErrorMsg(''); })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, [selectedQuiz]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editId) {
        const updated = await updateQuestion(editId, {
          question: form.question, optionA: form.optionA, optionB: form.optionB,
          optionC: form.optionC, optionD: form.optionD, correctAnswer: form.correctAnswer,
        });
        setQuestions((prev) => prev.map((q) => (q.id === editId ? updated : q)));
        setSuccessMsg('Question updated successfully!');
        setEditId(null);
      } else {
        const newQ = await addQuestion(form.quizId, {
          question: form.question, optionA: form.optionA, optionB: form.optionB,
          optionC: form.optionC, optionD: form.optionD, correctAnswer: form.correctAnswer,
        });
        if (String(selectedQuiz) === String(form.quizId)) {
          setQuestions((prev) => [...prev, newQ]);
        }
        setSuccessMsg('Question added successfully!');
      }
      setForm(EMPTY_FORM);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setForm({ quizId: String(q.quizId), question: q.question, optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD, correctAnswer: q.correctAnswer });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteQuestionApi(deleteTarget.id);
      setQuestions((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      setSuccessMsg('Question deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { setErrorMsg(err.message); }
    setDeleteTarget(null);
  };

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

          {successMsg && <div className="alert alert-success alert-dismissible fade show">{successMsg}<button type="button" className="btn-close" onClick={() => setSuccessMsg('')} aria-label="Close"></button></div>}
          {errorMsg && <div className="alert alert-danger alert-dismissible fade show">{errorMsg}<button type="button" className="btn-close" onClick={() => setErrorMsg('')} aria-label="Close"></button></div>}

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
                    <select className="form-select" id="quizId" name="quizId" value={form.quizId} onChange={handleChange} required disabled={!!editId}>
                      <option value="">-- Choose a Quiz --</option>
                      {quizList.map((q) => (<option key={q.id} value={q.id}>{q.title}</option>))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="correctAnswer" className="form-label fw-semibold">Correct Answer</label>
                    <select className="form-select" id="correctAnswer" name="correctAnswer" value={form.correctAnswer} onChange={handleChange} required>
                      <option value="">-- Select --</option>
                      <option value="A">Option A</option><option value="B">Option B</option><option value="C">Option C</option><option value="D">Option D</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="question" className="form-label fw-semibold">Question</label>
                    <textarea className="form-control" id="question" name="question" rows="2" placeholder="Enter your question" value={form.question} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="optionA" className="form-label fw-semibold">Option A</label>
                    <input type="text" className="form-control" id="optionA" name="optionA" placeholder="Option A" value={form.optionA} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="optionB" className="form-label fw-semibold">Option B</label>
                    <input type="text" className="form-control" id="optionB" name="optionB" placeholder="Option B" value={form.optionB} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="optionC" className="form-label fw-semibold">Option C</label>
                    <input type="text" className="form-control" id="optionC" name="optionC" placeholder="Option C" value={form.optionC} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="optionD" className="form-label fw-semibold">Option D</label>
                    <input type="text" className="form-control" id="optionD" name="optionD" placeholder="Option D" value={form.optionD} onChange={handleChange} required />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-4">
                  <button type="submit" className="btn btn-primary px-4">{editId ? '💾 Update Question' : '➕ Add Question'}</button>
                  {editId && <button type="button" className="btn btn-outline-secondary px-4" onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}>Cancel</button>}
                </div>
              </form>
            </div>
          </div>

          {/* Filter + table */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0 fw-semibold">Questions List</h5>
              <select className="form-select form-select-sm" style={{ maxWidth: 260 }} value={selectedQuiz} onChange={(e) => setSelectedQuiz(e.target.value)}>
                <option value="">-- Select a Quiz --</option>
                {quizList.map((q) => (<option key={q.id} value={q.id}>{q.title}</option>))}
              </select>
            </div>
            <div className="card-body p-0">
              {!selectedQuiz ? (
                <div className="text-center text-muted py-5">Select a quiz above to view its questions.</div>
              ) : loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr><th>#</th><th>Question</th><th>Option A</th><th>Option B</th><th>Option C</th><th>Option D</th><th>Answer</th><th className="text-center">Actions</th></tr>
                    </thead>
                    <tbody>
                      {questions.length === 0 ? (
                        <tr><td colSpan="8" className="text-center text-muted py-4">No questions found for this quiz.</td></tr>
                      ) : questions.map((q, i) => (
                        <tr key={q.id}>
                          <td>{i + 1}</td>
                          <td className="fw-medium" style={{ minWidth: 200 }}>{q.question}</td>
                          <td>{q.optionA}</td><td>{q.optionB}</td><td>{q.optionC}</td><td>{q.optionD}</td>
                          <td><span className="badge bg-primary">{q.correctAnswer}</span></td>
                          <td>
                            <div className="d-flex gap-1 justify-content-center">
                              <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(q)}>✏️ Edit</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(q)}>🗑️ Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <ConfirmModal show={!!deleteTarget} title="Delete Question" message="Are you sure you want to delete this question?" itemName={deleteTarget?.question} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
