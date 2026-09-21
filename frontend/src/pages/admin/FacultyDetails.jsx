import { useEffect, useMemo, useState } from 'react';
import { getFaculty } from '../../services/adminService';

/**
 * Faculty Details (Admin).
 *
 * Read-only view of faculty members with the number of quizzes each has
 * created and their status. Data comes from the backend (/api/admin/faculty),
 * which returns quizzesCreated and status per faculty user.
 */
export default function FacultyDetails() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getFaculty()
      .then(setFaculty)
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load faculty.'));
  }, []);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return faculty.filter(
      (f) =>
        !term ||
        f.name.toLowerCase().includes(term) ||
        f.email.toLowerCase().includes(term) ||
        String(f.id).includes(term)
    );
  }, [faculty, search]);

  return (
    <div>
      <h1 className="h3 mb-1">Faculty Details</h1>
      <p className="text-muted">View faculty members and their quiz activity.</p>

      {error && <div className="alert alert-danger">{error}</div>}

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
