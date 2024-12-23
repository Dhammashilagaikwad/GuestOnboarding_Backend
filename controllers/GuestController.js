const Guest = require('../models/GuestModel');
const User = require('../models/Role');
const Hotel = require('../models/AddHotelModel');


exports.createGuest = async (req, res) => {
  try {
    const { hotelId, fullName, mobileNumber, address, purposeOfVisit, stayFrom, stayTo, email, idProof } = req.body;

    const guest = new Guest({
      hotelId,
      fullName,
      mobileNumber,
      address,
      purposeOfVisit,
      stayFrom,
      stayTo,
      email,
      idProof,
    });

    await guest.save();
    res.status(201).json({ message: 'Guest added successfully', guest });
  } catch (error) {
    res.status(500).json({ error: 'Error adding guest', details: error.message });
  }
};

// Middleware to validate guest_admin role and hotel access
exports.checkGuestAdminAccess = async (req, res, next) => {
  try {
    console.log("User ID:", req.user.id);
    
    const { hotelId } = req.params; 
    const userId = req.user.id; 

    console.log("Hotel ID from params:", hotelId);
    const user = await User.findById(userId);

    // Check if user exists and has the guest_admin role
    if (!user || user.role !== 'guest_admin') {
      return res.status(403).json({ message: 'Access denied. Only guest_admin users can access this data.' });
    }

    

    next(); 
  } catch (error) {
    console.error('Error in role validation middleware:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};



// Fetch all guests for a specific hotel (only accessible by guest_admin)
exports.getAllGuests = async (req, res) => {
  const timeout = 5000; // Timeout in milliseconds (e.g., 5000ms = 5 seconds)

  try {
    // Set a global timeout for mongoose queries
    const queryTimeout = mongoose.connection.client.getEngine().getRequestTimeout();

    // Set timeout only for this query
    mongoose.connection.client.setTimeout(timeout);

    const guests = await Guest.find().populate("hotelId"); 

    // Reset timeout to default after query
    mongoose.connection.client.setTimeout(queryTimeout);

    const guestData = guests.map((guest) => ({
      _id: guest._id,
      fullName: guest.fullName,
      email: guest.email,
      mobileNumber: guest.mobileNumber,
      stayFrom: guest.stayFrom,
      stayTo: guest.stayTo,
      hotelName: guest.hotelId ? guest.hotelId.name : "N/A",
      hotelId: guest.hotelId ? guest.hotelId._id : undefined, 
    }));

    res.status(200).json({ success: true, data: guestData });
  } catch (error) {
    console.error("Error fetching guests:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.editGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDetails = req.body;

    const updatedGuest = await Guest.findByIdAndUpdate(id, updatedDetails, { new: true });
    if (!updatedGuest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.status(200).json({ message: "Guest updated successfully", data: updatedGuest });
  } catch (error) {
    res.status(500).json({ message: "Failed to update guest", error: error.message });
  }
};
