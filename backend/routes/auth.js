const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const handler = require("../utils/handler")
const User = require("../models/user");
const {auth} = require("../middleware/auth")

const router = express.Router();
function makeToken(user) {
    return jwt.sign ({id: user._id}, process.env.JWT_SECRET,{expiresIn: "5d"});
}

function userResponse(user){
    return { id: user._id, name: user.name, email: user.email, role: user.role}
}

router.post(
"/register", 
handler (async(req, res) => {
    const { name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message:"All are required"});
    }
    if(password.length < 6){
        return res.status(400).json({message:"Password must be more than 6 characters"});
    }

    const exists = await User.findOne({email: email.toLowerCase()});
    if (exists)
        return res.status(400).json({message: "Email already exists"});

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({name, email: email.toLowerCase(), password: hashed});

    res.status(201).json({token: makeToken(user), user: userResponse(user)});
    })
);

router.post(
    "/login",
    handler(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({message:"Email and password are required"});
        }

        const user = await User.findOne({email:email.toLowerCase()});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({message:"Invalid email or password"});
        }
        res.json({token: makeToken(user), user: userResponse(user)});
    })
);

router.get("/me", auth, (req, res) => {
    res.json(userResponse(req.user));
});

module.exports = router;