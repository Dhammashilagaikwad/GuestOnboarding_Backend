const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../services/auth');
const { createGuest, getAllGuests,editGuest, checkGuestAdminAccess } = require('../controllers/GuestController');


router.post('/guest-details',   createGuest);

router.get('/getAllGuests', authenticateUser, checkGuestAdminAccess, getAllGuests);

router.put('/updateGuest/:id', authenticateUser, checkGuestAdminAccess, editGuest);

module.exports = router;
