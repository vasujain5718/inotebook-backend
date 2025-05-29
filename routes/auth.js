const express = require('express')
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchuser = require('../midware/fetchuser');


const JWT_SECRET="vasu.love$sashi!very^very*much$"
router.post('/createUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters long').isLength({ min: 5 })
], async (req, res) => {
    let success = 0;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if(errors.array()[0].msg === "Password must be at least 5 characters long") {
            success = 1;
        }
        else if(errors.array()[0].msg === "Enter a valid name") {
            success = 2;
        }
        return res.status(400).json({ errors: errors.array(), success });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        success = 3;
        return res.status(400).json({ error: "Sorry a user with this email already exists", success })
    }
    const salt = await bcrypt.genSalt(10);
    const secrurepass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secrurepass
    })
    const data = {
        user: {
            id: user.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ authToken, success });
})
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let sucess=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() , sucess})
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" , sucess});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" , sucess});
        }
        const data = {
            user: {
                id: user.id
            }
        }
        sucess=true;
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken , sucess});
    } catch (error) {
        console.error(error.message);
        success=false;
        res.status(500).send("Internal Server Error");
    }
})
router.post('/getUser',fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;