const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', tournamentController.getTournaments);
router.get('/:id', tournamentController.getTournament);
router.get('/:id/standings', tournamentController.getStandings);
router.get('/:id/analytics', tournamentController.getMatchmakingAnalytics);

// Protected routes (require authentication)
router.use(authMiddleware);

router.post('/', tournamentController.createTournament);
router.put('/:id', tournamentController.updateTournament);
router.post('/:id/join', tournamentController.joinTournament);
router.post('/:id/start', tournamentController.startTournament);
router.post('/:id/next-round', tournamentController.generateNextRound);
router.put('/:id/matchmaking-settings', tournamentController.updateMatchmakingSettings);

module.exports = router;