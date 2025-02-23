const jwt = require('jsonwebtoken');
const SECRET_KEY = 'supersecretkey'; // Usa una clave secreta fuerte

// Función para generar el token JWT
function generateToken(user) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: "1h" }); // El token expirará en 1 hora
}

// MW para verificar el token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    
    // Verifica si existe el token
    if (!token) {
        return res.status(403).json({ error: 'Token requerido' });
    }

    // Verifica que el token sea válido
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        req.user = decoded;
        next();
    });
}

module.exports = { generateToken, verifyToken };
