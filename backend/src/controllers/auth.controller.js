import AuthService from '../services/auth.service.js';

class AuthController {
  
  async login(req, res) {
    try {
      console.log('=== LOGIN ATTEMPT START ===');
      console.log('Received body:', JSON.stringify(req.body));
      console.log('Environment check:');
      console.log('- NODE_ENV:', process.env.NODE_ENV);
      console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
      console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
      console.log('- FIREBASE_CLIENT_EMAIL exists:', !!process.env.FIREBASE_CLIENT_EMAIL);
      console.log('- FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);
      
      const { email, password } = req.body;
      
      // Tu código actual de login...
      const result = await authService.login(email, password);
      
      console.log('=== LOGIN SUCCESS ===');
      res.json(result);
      
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      res.status(401).json({ 
        error: error.message || 'Error en la autenticación' 
      });
    }
  }
}

export default new AuthController();