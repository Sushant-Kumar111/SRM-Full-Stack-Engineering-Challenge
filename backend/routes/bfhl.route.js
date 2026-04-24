const express = require('express');
const router = express.Router();
const bfhlController = require('../controllers/bfhl.controller');

router.get('/', bfhlController.getBfhl);
router.post('/', bfhlController.postBfhl);
router.get('/test', bfhlController.runInternalTests);

module.exports = router;
