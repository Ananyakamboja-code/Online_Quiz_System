import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import { createQuiz } from '../../services/facultyApi';

const INITIAL_FORM = {
  title: '',
  description: '',
  duration: '',
  numberOfQuestions: '',
  startDate: '',
  endDate: '',
  status: 'Draft',
};

export default function CreateQuiz() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await createQuiz(form);
      setSuccessMsg(`Quiz "${form.title}" created successfully!`);
      setForm(INITIAL_FORM);
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/faculty/my-quizzes');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm(INITIAL_FORM);
    setSuccessMsg('');
    setErrorMsg('');
  };

  return (
    <div className="faculty-layout d-flex flex-column min-vh-100">
      <FacultyHeader />
      <div className="d-flex flex-grow-1">
        <FacultySidebar />
        <main className="faculty-content flex-grow-1 p-4 bg-light">
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Create Quiz</h2>
            <p className="text-muted">Fill in the details below to create a new quiz.</p>
          </div>

          {successMsg && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMsg}
              <button type="button" className="btn-close" onClick={() => setSuccessMsg('')} aria-label="Close"></button>
            </div>
          )}
          {errorMsg && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {errorMsg}
              <button type="button" className="btn-close" onClick={() => setErrorMsg('')} aria-label="Close"></button>
            </div>
          )}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="title" className="form-label fw-semibold">Quiz Title</label>
                    <input type="text" className="form-control" id="title" name="title"
                      placeholder="Enter quiz title" value={form.title} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="duration" className="form-label fw-semibold">Duration (minutes)</label>
                    <input type="number" className="form-control" id="duration" name="duration"
                      placeholder="e.g. 30" value={form.duration} onChange={handleChange} min="1" required />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="numberOfQuestions" className="form-label fw-semibold">Number of Questions</label>
                    <input type="number" className="form-control" id="numberOfQuestions" name="numberOfQuestions"
                      placeholder="e.g. 20" value={form.numberOfQuestions} onChange={handleChange} min="1" required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="description" className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" id="description" name="description" rows="3"
                      placeholder="Brief description of the quiz" value={form.description} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="startDate" className="form-label fw-semibold">Start Date</label>
                    <input type="date" className="form-control" id="startDate" name="startDate"
                      value={form.startDate} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="endDate" className="form-label fw-semibold">End Date</label>
                    <input type="date" className="form-control" id="endDate" name="endDate"
                      value={form.endDate} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="status" className="form-label fw-semibold">Status</label>
                    <select className="form-select" id="status" name="status" value={form.status} onChange={handleChange}>
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex gap-3 mt-4">
                  <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                    {loading ? '⏳ Creating...' : '➕ Create Quiz'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={handleClear}>
                    🗑️ Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
