const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticateUser } = require('../services/auth');
const {
  addHotel,
  getAllHotels,
  getAllHotelsForGuest,
  editHotel,
  deleteHotel,
  getHotelByHotelId
} = require('../controllers/AddHotelController');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = '/tmp';
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


router.post('/add', authenticateUser, (req, res, next) => {
  if (req.user.role !== 'main_admin') {
    return res.status(403).json({ message: 'Access denied. Only Main Admin can add hotels.' });
  }
  next();
}, upload.single('logo'), addHotel);


router.get('/all', getAllHotels);


router.get('/guest-all', getAllHotelsForGuest);


router.get('/:hotelId', getHotelByHotelId);


router.put('/edit-hotel/:id', authenticateUser, (req, res, next) => {
  if (req.user.role !== 'main_admin') {
    return res.status(403).json({ message: 'Access denied. Only Main Admin can edit hotels.' });
  }
  next();
}, upload.single('logo'), editHotel);

router.delete('/delete-hotel/:id', authenticateUser, (req, res, next) => {
  if (req.user.role !== 'main_admin') {
    return res.status(403).json({ message: 'Access denied. Only Main Admin can delete hotels.' });
  }
  next();
}, deleteHotel);

module.exports = router;
