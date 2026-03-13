import axios from 'axios';

const api = axios.create({
baseURL: 'http://localhost:5000/api',
});

/* ======================
GET DATA
====================== */

export const getTeams = () => api.get('/teams');
export const getDrivers = () => api.get('/drivers');
export const getCars = () => api.get('/cars');
export const getRaces = () => api.get('/races');
export const getResults = () => api.get('/results');

/* ======================
DRIVERS
====================== */

export const addDriver = (data) => api.post('/drivers', data);
export const deleteDriver = (id) => api.delete(`/drivers/${id}`);
export const updateDriver = (id, data) => api.put(`/drivers/${id}`, data);

/* ======================
TEAMS
====================== */

export const addTeam = (data) => api.post('/teams', data);
export const deleteTeam = (id) => api.delete(`/teams/${id}`);
export const updateTeam = (id, data) => api.put(`/teams/${id}`, data);

/* ======================
CARS
====================== */

export const addCar = (data) => api.post('/cars', data);
export const deleteCar = (id) => api.delete(`/cars/${id}`);
export const updateCar = (id, data) => api.put(`/cars/${id}`, data);

/* ======================
RACES
====================== */

export const addRace = (data) => api.post('/races', data);
export const deleteRace = (id) => api.delete(`/races/${id}`);
export const updateRace = (id, data) => api.put(`/races/${id}`, data);

/* ======================
RESULTS
====================== */

export const addResult = (data) => api.post('/results', data);
export const deleteResult = (id) => api.delete(`/results/${id}`);
export const updateResult = (id, data) => api.put(`/results/${id}`, data);

export default api;
