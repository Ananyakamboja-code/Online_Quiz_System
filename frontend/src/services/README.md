# services/

Shared API layer for the frontend.

- `api.js` — the single centralized Axios instance. Import it everywhere:
  ```js
  import api from '../services/api';
  ```
  Do **not** create separate Axios instances in feature code. Base URL and
  auth (future JWT) live here so all three modules behave consistently.

## Suggested convention for the team

Create per-module service files that use the shared instance, e.g.:

- `adminService.js`   → owned by the Admin developer
- `studentService.js` → owned by the Student developer
- `facultyService.js` → owned by the Faculty developer

Example:
```js
import api from './api';

export const getQuizzes = () => api.get('/admin/quizzes');
```

No real API calls are made yet — the backend does not exist.
