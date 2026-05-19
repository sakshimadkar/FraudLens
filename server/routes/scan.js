const express = require('express');
const router = express.Router();
const { performScan, getHistory, deleteScan } = require('../controllers/scanController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', performScan);
router.get('/history', getHistory);
router.delete('/:id', deleteScan);

module.exports = router;
