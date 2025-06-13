const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/statistics', matchController.getMatchStatistics);
router.get('/tournament/:tournamentId', matchController.getTournamentMatches);
router.get('/:id', matchController.getMatch);

// Protected routes (require authentication)
router.use(authMiddleware);

router.get('/player/my-matches', matchController.getPlayerMatches);
router.put('/:id', matchController.updateMatchResult);
router.post('/:id/start', matchController.startMatch);
router.post('/:id/report', matchController.reportResult);

module.exports = router;