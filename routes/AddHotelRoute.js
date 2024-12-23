const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

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


// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


const upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      acl: 'public-read', // or other permissions you prefer
      metadata: (req, file, cb) => {
          cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
          cb(null, `hotel-logos/${Date.now()}-${file.originalname}`);
      },
  }),
});


// Adjust your routes to use the new `upload` middleware
router.post(
  '/add',
  authenticateUser,
  (req, res, next) => {
      if (req.user.role !== 'main_admin') {
          return res.status(403).json({ message: 'Access denied. Only Main Admin can add hotels.' });
      }
      next();
  },
  upload.single('logo'),
  addHotel
);


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
