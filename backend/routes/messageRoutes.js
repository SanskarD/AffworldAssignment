const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const { sendMessage, getAllMessages } = require('../controllers/messageControllers')
const router = express.Router()


router.route('/').all(protect).post(sendMessage).get(getAllMessages)

module.exports = router