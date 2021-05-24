const express = require('express');
const router = express.Router();
const authToken = require('../../middleware/auth')
const { addLink, getLinks, removeLink, updateLink, removeLinkList } = require('../controllers/ShareController');
const { createUser, loginUser, getProfile } = require('../controllers/UserController');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({success: true})
});

router.post('/join', createUser);
router.post('/login', loginUser);
router.get('/me', authToken, getProfile);

router.post('/share/add', authToken, addLink);
router.get('/share/list', authToken, getLinks);
router.delete('/link/:linkId', authToken, removeLink);
router.put('/link/remove', authToken, removeLinkList);
router.put('/link/:linkId', authToken, updateLink)

module.exports = router;
