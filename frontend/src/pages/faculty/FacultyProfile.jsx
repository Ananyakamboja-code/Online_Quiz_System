import { useState, useEffect } from 'react';
import FacultySidebar from '../../components/faculty/FacultySidebar';
import FacultyHeader from '../../components/faculty/FacultyHeader';
import { getProfile, updateProfile } from '../../services/facultyApi';

export default function FacultyProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => { setProfile(data); setForm(data); setErrorMsg(''); })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile({ name: form.name, phone: form.phone, department: form.department });
      setProfile(updated);
      setForm(updated);
      setEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleCancel = () => { setForm(profile); setEditing(false); };

  const initials = profile?.name
    ? profile.name.split(' ').filter((w) => w[0] === w[0].toUpperCase()).map((w) => w[0]).join('').slice(0, 2)
    : 'FU';

  if (loading) {
    return (
      <div className="faculty-layout d-flex flex-column min-vh-100">
        <FacultyHeader />
        <div className="d-flex flex-grow-1">
          <FacultySidebar />
          <main className="faculty-content flex-grow-1 p-4 bg-light d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary"></div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-layout d-flex flex-column min-vh-100">
      <FacultyHeader />
      <div className="d-flex flex-grow-1">
        <FacultySidebar />
        <main className="faculty-content flex-grow-1 p-4 bg-light">
          <div className="mb-4">
            <h2 className="fw-bold mb-1">Faculty Profile</h2>
            <p className="text-muted">View and manage your profile information.</p>
          </div>

          {successMsg && <div className="alert alert-success alert-dismissible fade show">{successMsg}<button type="button" className="btn-close" onClick={() => setSuccessMsg('')} aria-label="Close"></button></div>}
          {errorMsg && <div className="alert alert-danger alert-dismissible fade show">{errorMsg}<button type="button" className="btn-close" onClick={() => setErrorMsg('')} aria-label="Close"></button></div>}

          {profile && (
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm text-center">
                  <div className="card-body py-5">
                    <div className="faculty-profile-avatar mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                         style={{ width: 100, height: 100, fontSize: '2rem', background: 'linear-gradient(135deg, #4e73df, #224abe)', color: '#fff' }}>
                      {initials}
                    </div>
                    <h5 className="fw-bold mb-1">{profile.name}</h5>
                    <p className="text-muted mb-1">{profile.department || 'No department set'}</p>
                    <span className="badge bg-primary">{profile.employeeId || profile.role}</span>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-semibold">Profile Details</h5>
                    {!editing && <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>}
                  </div>
                  <div className="card-body">
                    {editing ? (
                      <form onSubmit={handleSave}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                            <input type="text" className="form-control" id="name" name="name" value={form.name || ''} onChange={handleChange} required />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="email" className="form-label fw-semibold">Email</label>
                            <input type="email" className="form-control" id="email" name="email" value={form.email || ''} disabled />
                            <small className="text-muted">Email cannot be changed.</small>
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="phone" className="form-label fw-semibold">Phone</label>
                            <input type="tel" className="form-control" id="phone" name="phone" value={form.phone || ''} onChange={handleChange} />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="department" className="form-label fw-semibold">Department</label>
                            <input type="text" className="form-control" id="department" name="department" value={form.department || ''} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="d-flex gap-3 mt-4">
                          <button type="submit" className="btn btn-primary px-4">💾 Save Changes</button>
                          <button type="button" className="btn btn-outline-secondary px-4" onClick={handleCancel}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="row g-4">
                        {[
                          { label: 'Full Name',   value: profile.name,                         icon: '👤' },
                          { label: 'Email',       value: profile.email,                        icon: '📧' },
                          { label: 'Phone',       value: profile.phone || 'Not set',           icon: '📱' },
                          { label: 'Department',  value: profile.department || 'Not set',      icon: '🏫' },
                          { label: 'Employee ID', value: profile.employeeId || 'Not assigned', icon: '🆔' },
                        ].map((item) => (
                          <div className="col-md-6" key={item.label}>
                            <div className="d-flex align-items-start gap-2">
                              <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                              <div><p className="text-muted small mb-0">{item.label}</p><p className="fw-medium mb-0">{item.value}</p></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
