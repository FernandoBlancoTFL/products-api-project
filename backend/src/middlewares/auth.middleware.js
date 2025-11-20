import AuthService from '../services/auth.service.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Token de autenticación no proporcionado' 
      });
    }
    
    // Verificar formato: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        error: 'Formato de token inválido' 
      });
    }
    
    const token = parts[1];
    
    // Verificar token
    const decoded = AuthService.verifyToken(token);
    
    // Agregar información del usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    const statusCode = error.statusCode || 403;
    res.status(statusCode).json({ 
      error: error.message || 'No autorizado' 
    });
  }
};

export default authMiddleware;