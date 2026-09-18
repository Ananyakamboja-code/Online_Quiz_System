/**
 * Result service (Admin).
 *
 * Read-only for the Admin results view. Mock-backed for now; ready to become
 * Axios calls to http://localhost:8080/api later.
 */
import { mockResults } from '../data/mockData';
// import api from './api';

const resolve = (data) => Promise.resolve(data);

export const getResults = () => {
  // return api.get('/admin/results').then((res) => res.data);
  return resolve(mockResults);
};
