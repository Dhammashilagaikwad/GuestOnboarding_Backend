const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const config = require('./config/config');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/auth');

const hotelRoutes = require('./routes/AddHotelRoute');
const RoleRoutes = require('./routes/RoleRoutes');
const GuestRoutes = require('./routes/GuestRoute');


const app = express ();
const cors = require("cors");

app.use(cors({ 
    origin: "http://localhost:3000", // Allow requests from React frontend
    credentials: true // Allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

connectDB();

app.use('/hotel-logos', express.static(path.join(__dirname, 'public', 'hotel-logos')));


app.use('/api/hotels',hotelRoutes)
app.use('/api/roles',RoleRoutes)
app.use('/api/guests',GuestRoutes)

app.get('/',(req,res) => {
    res.status(200).json({status:true, message:"your msg is submitted"});
});
const PORT = config.port

app.listen(PORT, () => 
  console.log(`Server is running on port ${PORT}`));
