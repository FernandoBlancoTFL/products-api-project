import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthService {
  
  async login(email, password) {
    try {
      // En producción, validar contra la base de datos
      // Aquí usamos credenciales de prueba del .env
      const validEmail = process.env.TEST_USER_EMAIL;
      const validPassword = process.env.TEST_USER_PASSWORD;
      
      if (email !== validEmail || password !== validPassword) {
        const error = new Error('Credenciales inválidas');
        error.statusCode = 401;
        throw error;
      }
      
      // Generar JWT token
      const token = jwt.sign(
        { 
          email,
          role: 'admin'
        },
        process.env.JWT_SECRET,
        { 
          expiresIn: process.env.JWT_EXPIRES_IN 
        }
      );
      
      return {
        token,
        user: {
          email,
          role: 'admin'
        }
      };
    } catch (error) {
      throw error;
    }
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      const authError = new Error('Token inválido o expirado');
      authError.statusCode = 401;
      throw authError;
    }
  }
}

export default new AuthService();