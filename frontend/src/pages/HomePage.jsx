import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

/**
 * Landing page. Neutral entry point that links into each module.
 * Shared file — keep it simple; module work goes under pages/<role>/.
 */
export default function HomePage() {
  return (
    <AppLayout>
      <h1 className="h3 mb-3">Online Quiz System</h1>
      <p className="text-muted">Choose a module to get started.</p>
      <div className="d-flex gap-2">
        <Link className="btn btn-primary" to="/admin">
          Admin
        </Link>
        <Link className="btn btn-outline-primary" to="/student">
          Student
        </Link>
        <Link className="btn btn-outline-primary" to="/faculty">
          Faculty
        </Link>
      </div>
    </AppLayout>
  );
}
