import { useEffect, useState } from 'react';
import { getFaculty } from '../../services/adminService';

/**
 * Reusable quiz form used by both Create and Edit pages.
 *
 * Props:
 * - initialValues: { title, description, duration, facultyId } to prefill
 * - onSubmit(values): called with validated values ({ title, description, duration, facultyId })
 * - onCancel(): called when Cancel is clicked
 * - submitLabel: text for the submit button
 *
 * Validation is basic and client-side only: title/description/faculty required,
 * duration must be a positive number. The faculty dropdown is loaded from the
 * backend (real FACULTY users); the server derives facultyName from facultyId.
 *
 * NOTE: Admin sets quiz-level data including which faculty owns the quiz.
 * Questions are NOT part of this form — they are managed by the Faculty module.
 */
const EMPTY = { title: '', description: '', duration: '', facultyId: '' };

export default function QuizForm({
  initialValues = EMPTY,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [faculty, setFaculty] = useState([]);
  const [facultyError, setFacultyError] = useState('');

  useEffect(() => {
    getFaculty()
      .then(setFaculty)
      .catch(() => setFacultyError('Could not load faculty list.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!values.title.trim()) next.title = 'Title is required.';
    if (!values.description.trim()) next.description = 'Description is required.';
    const duration = Number(values.duration);
    if (!values.duration && values.duration !== 0) {
      next.duration = 'Duration is required.';
    } else if (Number.isNaN(duration) || duration <= 0) {
      next.duration = 'Duration must be a positive number (minutes).';
    }
    if (!values.facultyId) next.facultyId = 'Please select a faculty.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      duration: Number(values.duration),
      facultyId: Number(values.facultyId),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title <span className="text-danger">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. JavaScript Fundamentals"
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description <span className="text-danger">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          value={values.description}
          onChange={handleChange}
          placeholder="Short summary of what the quiz covers"
        />
        {errors.description && (
          <div className="invalid-feedback">{errors.description}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="duration" className="form-label">
          Duration (minutes) <span className="text-danger">*</span>
        </label>
        <input
          id="duration"
          name="duration"
          type="number"
          min="1"
          className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
          value={values.duration}
          onChange={handleChange}
          placeholder="e.g. 30"
        />
        {errors.duration && (
          <div className="invalid-feedback">{errors.duration}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="facultyId" className="form-label">
          Faculty / Created By <span className="text-danger">*</span>
        </label>
        <select
          id="facultyId"
          name="facultyId"
          className={`form-select ${errors.facultyId ? 'is-invalid' : ''}`}
          value={values.facultyId}
          onChange={handleChange}
        >
          <option value="">Select Faculty</option>
          {faculty.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        {errors.facultyId && (
          <div className="invalid-feedback">{errors.facultyId}</div>
        )}
        {facultyError && (
          <div className="form-text text-danger">{facultyError}</div>
        )}
        {!facultyError && faculty.length === 0 && (
          <div className="form-text">
            No faculty accounts yet. A FACULTY user must register first.
          </div>
        )}
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
