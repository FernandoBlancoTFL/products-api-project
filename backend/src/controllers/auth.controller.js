import AuthService from '../services/auth.service.js';

class AuthController {
  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y contraseña son requeridos' 
        });
      }
      
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
}

export default new AuthController();