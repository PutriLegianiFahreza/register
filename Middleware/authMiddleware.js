const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
    console.log("Auth middleware triggered");

    // Cek header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Authorization header:", req.header('Authorization'));
    console.log("Token received:", token);

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ada atau tidak valid' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("Decoded token:", decoded); // Debugging hasil decode token
        req.user = decoded; // Menyimpan data user yang terverifikasi di req.user
        next(); // Panggil middleware berikutnya
    } catch (err) {
        console.log("Error decoding token:", err);
        return res.status(401).json({ message: 'Token tidak valid', error: err.message });
    }
};
