const User = require('../model/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = require('../../../config/envConfig');


exports.createUser = async(req, res) => {
  const { name, email, password } = req.body;
    try{
         
        const haspassword = await bcrypt.hash(password, 10);
        const user =new User({
            name,
            email,
            password:haspassword
        })
        const savedUser =await user.save();
        res.status(201).json(savedUser);
        }catch (error) {
        res.status(500).json({ message: err.message });
    }
};
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Please provide email and password',
        });
    }

    try {
        const user = await User.findOne({ email }).select('password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }


        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
        );
        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Login error:', err.message);
        return res.status(500).json({
            message: 'Server error. Please try again later.',
        });
    }
};
exports.getUsers = async (req, res) => {
    try {
        const user = await User.find();
        if (!user) {
            return res.status(404).json({ message: 'Users not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getMe = async (req, res) => {
    try {
        const {userId, email} = req.user;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
} 

exports.showUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}   

exports.refreshTokenUsen = async (req, res) =>{
    const {refreshToken} = req.body;

    if (!refreshToken){
        return res.status(400).json({message:"Refresh token is required"});
    }
    try{
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if(!user || user.refreshToken !== refreshToken){
            return res.status(403).json({message:'Invalid refresh token'})
        }
        const newAccessToken = jwt.sign(
            {userId:user._id, email:user.email, role:user.role },JWT_SECRET,
            {expiresIn:ACCESS_TOKEN_EXPIRES_IN}
        );

        return res.status(200).json({
            accessToken:newAccessToken,
        });
    }catch(err){
        return res.status(403).json({message:'Invalid or expired refresh token'})
    }
};