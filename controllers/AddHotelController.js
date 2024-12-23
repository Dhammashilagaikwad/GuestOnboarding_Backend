const QRCode = require('qrcode');
const Hotel = require('../models/AddHotelModel'); 

// Add a new hotel

exports.addHotel = async (req, res) => {
    const { name, address } = req.body;

    if (!name || !address || !req.file) {
        return res.status(400).json({ message: 'All fields are required (name, address, logo).' });
    }

    try {
        const logo = req.file.location; // Get the S3 file URL
        const qrCodeData = `${process.env.FRONTEND_URL}/hotel/${name.replace(/ /g, '-')}`;
        const qrCodeImage = await QRCode.toDataURL(qrCodeData);

        const hotel = new Hotel({ name, address, logo, qrCode: qrCodeImage });
        await hotel.save();

        res.status(201).json({
            message: 'Hotel added successfully',
            hotel: { ...hotel.toObject(), qrCodeUrl: qrCodeImage },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding hotel.' });
    }
};


// Get all hotels
exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({ hotels });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching hotels.' });
    }
};

// Edit hotel details
exports.editHotel = async (req, res) => {
    const { name, address } = req.body;
    const hotelId = req.params.id;

    console.log('Received data:', { name, address, file: req.file, hotelId });

    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found.' });
        }

        if (name) hotel.name = name;
        if (address) hotel.address = address;
        if (req.file) {
            hotel.logo = `/hotel-logos/${req.file.filename}`;
        }

        await hotel.save();
        res.status(200).json({ message: 'Hotel updated successfully', hotel });
    } catch (error) {
        console.error('Error saving hotel:', error);
        res.status(500).json({ message: 'Error updating hotel.' });
    }
};


// Delete a hotel
exports.deleteHotel = async (req, res) => {
    const hotelId = req.params.id;

    try {
        const hotel = await Hotel.findByIdAndDelete(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found.' });
        }

        res.status(200).json({ message: 'Hotel deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting hotel.' });
    }
};

// Get all hotels for guests (public view)
exports.getAllHotelsForGuest = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({ hotels });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching hotels.' });
    }
};

exports.getHotelByHotelId = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.json({ hotel });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hotel details' });
    }
};
