import { useEffect, useMemo, useState } from 'react';
import { mockFaculty } from '../../data/mockData';
import { listQuizzes } from '../../data/quizStore';

/**
 * Faculty Details (Admin).
 *
 * Read-only view of faculty members with the number of quizzes each has
 * created and their status. Quiz counts are derived from the quizStore so they
 * stay in sync with quizzes created/deleted during the session.
 *
 * Mock-backed for now — replace with a facultyService Axios call later.
 */
export default function FacultyDetails() {
  const [faculty, setFaculty] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFaculty(mockFaculty);
    setQuizzes(listQuizzes());
  }, []);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return faculty
      .map((f) => ({
        ...f,
        quizzesCreated: quizzes.filter((q) => q.facultyId === f.id).length,
      }))
      .filter(
        (f) =>
          !term ||
          f.name.toLowerCase().includes(term) ||
          f.email.toLowerCase().includes(term) ||
          f.id.toLowerCase().includes(term)
      );
  }, [faculty, quizzes, search]);

  return (
    <div>
      <h1 className="h3 mb-1">Faculty Details</h1>
      <p className="text-muted">View faculty members and their quiz activity.</p>

      <div className="mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search faculty by name, email, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search faculty"
        />
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: '120px' }}>Faculty ID</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: '160px' }}>Quizzes Created</th>
                <th style={{ width: '120px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    No faculty found.
                  </td>
                </tr>
              ) : (
                rows.map((f) => (
                  <tr key={f.id}>
                    <td className="fw-semibold">{f.id}</td>
                    <td>{f.name}</td>
                    <td className="text-muted">{f.email}</td>
                    <td>{f.quizzesCreated}</td>
                    <td>
                      <span
                        className={`badge ${
                          f.status === 'Active'
                            ? 'text-bg-success'
                            : 'text-bg-secondary'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
