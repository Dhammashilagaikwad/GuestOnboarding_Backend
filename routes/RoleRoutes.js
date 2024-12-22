const { Router } = require("express");
const router = Router();
const { authenticateUser } = require("../services/auth");
const { signup, login , logout} = require("../controllers/RoleController");



router.post('/signup',signup);


router.post('/login',login);

router.post('/logout',logout);
module.exports = router;
