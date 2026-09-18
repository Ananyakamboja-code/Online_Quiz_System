/**
 * Reusable student profile card.
 *
 * Presentation-only. Receives the student object (currently mock data) and
 * optional aggregate stats. Designed so it can later be fed the authenticated
 * student's profile without any structural change.
 *
 * NOTE: No authentication, JWT, or backend calls here by design.
 */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function ProfileDetail({ label, value }) {
  return (
    <div className="col-sm-6 col-lg-4 mb-2">
      <div className="profile-detail-label">{label}</div>
      <div className="profile-detail-value text-break">{value || "—"}</div>
    </div>
  );
}

function StudentProfileCard({ student, stats }) {
  if (!student) return null;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mb-3">
          {/* Avatar placeholder using initials (no external asset needed) */}
          <div className="profile-avatar" aria-hidden="true">
            {getInitials(student.name) || (
              <i className="bi bi-person-fill"></i>
            )}
          </div>
          <div>
            <h4 className="fw-bold mb-0">{student.name}</h4>
            <span className="badge bg-primary-subtle text-primary-emphasis mt-1">
              <i className="bi bi-mortarboard-fill me-1"></i>
              {student.role || "STUDENT"}
            </span>
          </div>

          {stats && (
            <div className="ms-sm-auto d-flex gap-4 text-center">
              <div>
                <div className="h5 fw-bold mb-0">{stats.attempted}</div>
                <div className="small text-muted">Attempted</div>
              </div>
              <div>
                <div className="h5 fw-bold mb-0">{stats.completed}</div>
                <div className="small text-muted">Completed</div>
              </div>
            </div>
          )}
        </div>

        <hr className="my-3" />

        <div className="row g-2">
          <ProfileDetail label="Student ID" value={student.studentId} />
          <ProfileDetail label="Email" value={student.email} />
          <ProfileDetail label="Department" value={student.department} />
          <ProfileDetail label="Program" value={student.program} />
          <ProfileDetail label="Year" value={student.year} />
          <ProfileDetail label="Semester" value={student.semester} />
        </div>
      </div>
    </div>
  );
}

export default StudentProfileCard;
