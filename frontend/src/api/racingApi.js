import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getTeams = () => api.get('/teams');
export const getDrivers = () => api.get('/drivers');
export const getCars = () => api.get('/cars');
export const getRaces = () => api.get('/races');
export const getResults = () => api.get('/results');

export const addDriver = (data) => api.post('/drivers', data);
export const deleteDriver = (id) => api.delete(`/drivers/${id}`);

export default api;
