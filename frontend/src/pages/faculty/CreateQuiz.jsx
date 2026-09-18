import { useState } from 'react';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* No API — just show success with local state */
    setSuccessMsg(`Quiz "${form.title}" created successfully! (local state only)`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleClear = () => {
    setForm(INITIAL_FORM);
    setSuccessMsg('');
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

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Quiz Title */}
                  <div className="col-md-6">
                    <label htmlFor="title" className="form-label fw-semibold">Quiz Title</label>
                    <input type="text" className="form-control" id="title" name="title"
                      placeholder="Enter quiz title" value={form.title} onChange={handleChange} required />
                  </div>

                  {/* Duration */}
                  <div className="col-md-3">
                    <label htmlFor="duration" className="form-label fw-semibold">Duration (minutes)</label>
                    <input type="number" className="form-control" id="duration" name="duration"
                      placeholder="e.g. 30" value={form.duration} onChange={handleChange} min="1" required />
                  </div>

                  {/* Number of Questions */}
                  <div className="col-md-3">
                    <label htmlFor="numberOfQuestions" className="form-label fw-semibold">Number of Questions</label>
                    <input type="number" className="form-control" id="numberOfQuestions" name="numberOfQuestions"
                      placeholder="e.g. 20" value={form.numberOfQuestions} onChange={handleChange} min="1" required />
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label htmlFor="description" className="form-label fw-semibold">Description</label>
                    <textarea className="form-control" id="description" name="description" rows="3"
                      placeholder="Brief description of the quiz" value={form.description} onChange={handleChange} required />
                  </div>

                  {/* Start Date */}
                  <div className="col-md-4">
                    <label htmlFor="startDate" className="form-label fw-semibold">Start Date</label>
                    <input type="date" className="form-control" id="startDate" name="startDate"
                      value={form.startDate} onChange={handleChange} required />
                  </div>

                  {/* End Date */}
                  <div className="col-md-4">
                    <label htmlFor="endDate" className="form-label fw-semibold">End Date</label>
                    <input type="date" className="form-control" id="endDate" name="endDate"
                      value={form.endDate} onChange={handleChange} required />
                  </div>

                  {/* Status */}
                  <div className="col-md-4">
                    <label htmlFor="status" className="form-label fw-semibold">Status</label>
                    <select className="form-select" id="status" name="status" value={form.status} onChange={handleChange}>
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-3 mt-4">
                  <button type="submit" className="btn btn-primary px-4">
                    ➕ Create Quiz
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
