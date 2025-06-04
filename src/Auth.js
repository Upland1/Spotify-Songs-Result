import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'TU_SECRETO_SEGURIDAD';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Correo no encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default login;