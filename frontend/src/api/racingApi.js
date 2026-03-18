import axios from 'axios';

const api = axios.create({
baseURL: 'http://localhost:5000/api',
});

/* ======================
GET DATA
====================== */

export const getTeams = (params) => api.get('/teams', { params });
export const getDrivers = (params) => api.get('/drivers', { params });
export const getCars = (params) => api.get('/cars', { params });
export const getRaces = (params) => api.get('/races', { params });
export const getResults = (params) => api.get('/results', { params });
export const getUsers = () => api.get('/users');
export const getSeasons = () => api.get('/seasons');

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

/* ======================
USERS
====================== */

export const addUser = (data) => api.post('/users', data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

/* ======================
SEASONS
====================== */

export const addSeason = (data) => api.post('/seasons', data);
export const deleteSeason = (id) => api.delete(`/seasons/${id}`);
export const updateSeason = (id, data) => api.put(`/seasons/${id}`, data);

export default api;
