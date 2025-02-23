const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/auth");
const { getUserByUsername, createUser } = require("../models/users");

async function login(req, res) {
    const { username, password } = req.body;

    try {
        let user = await getUserByUsername(username);

        // Si el usuario no existe, lo creamos automáticamente
        if (!user) {
            console.log("👤 Usuario no encontrado. Creando uno nuevo...");
            const hashedPassword = await bcrypt.hash(password, 10); // Encriptamos la contraseña
            const userId = await createUser(username, hashedPassword); // Creamos el nuevo usuario
            user = { username, password: hashedPassword, _id: userId }; // Asignamos el nuevo usuario
        }

        // Generamos el token JWT
        const token = generateToken({ username });

        return res.json({ message: "Sesión iniciada correctamente", token });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

module.exports = { login };
