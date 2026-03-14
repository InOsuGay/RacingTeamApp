const express = require('express');
const router  = express.Router();

const users   = require('../controllers/users');
const teams   = require('../controllers/teams');
const drivers = require('../controllers/drivers');
const cars    = require('../controllers/cars');
const seasons = require('../controllers/seasons');
const races   = require('../controllers/races');
const results = require('../controllers/results');

// ── Users ────────────────────────────────────────────
router.get   ('/users',     users.getAll);
router.get   ('/users/:id', users.getById);
router.post  ('/users',     users.create);
router.put   ('/users/:id', users.update);
router.delete('/users/:id', users.remove);

// ── Teams ────────────────────────────────────────────
router.get   ('/teams',     teams.getAll);
router.get   ('/teams/:id', teams.getById);
router.post  ('/teams',     teams.create);
router.put   ('/teams/:id', teams.update);
router.delete('/teams/:id', teams.remove);

// ── Drivers ──────────────────────────────────────────
router.get   ('/drivers',     drivers.getAll);
router.get   ('/drivers/:id', drivers.getById);
router.post  ('/drivers',     drivers.create);
router.put   ('/drivers/:id', drivers.update);
router.delete('/drivers/:id', drivers.remove);

// ── Cars ─────────────────────────────────────────────
router.get   ('/cars',     cars.getAll);
router.get   ('/cars/:id', cars.getById);
router.post  ('/cars',     cars.create);
router.put   ('/cars/:id', cars.update);
router.delete('/cars/:id', cars.remove);

// ── Seasons ───────────────────────────────────────────
router.get   ('/seasons',          seasons.getAll);
router.get   ('/seasons/:id',      seasons.getById);
router.get   ('/seasons/:id/races',seasons.getRaces); // races ของฤดูกาลนี้
router.post  ('/seasons',          seasons.create);
router.put   ('/seasons/:id',      seasons.update);
router.delete('/seasons/:id',      seasons.remove);

// ── Races ─────────────────────────────────────────────
router.get   ('/races',             races.getAll);
router.get   ('/races/:id',         races.getById);
router.get   ('/races/:id/results', races.getResults); // ผลของ race นี้
router.post  ('/races',             races.create);
router.put   ('/races/:id',         races.update);
router.delete('/races/:id',         races.remove);

// ── Race Results ──────────────────────────────────────
router.get   ('/results',     results.getAll);
router.get   ('/results/:id', results.getById);
router.post  ('/results',     results.create);
router.put   ('/results/:id', results.update);
router.delete('/results/:id', results.remove);

module.exports = router;
