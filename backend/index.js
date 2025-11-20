import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import productsRoutes from './src/routes/products.routes.js';
import authRoutes from './src/routes/auth.routes.js';

// Cargar variables de entorno PRIMERO
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRoutes);
app.use('/auth', authRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Productos - Bienvenido',
    version: '1.0.0',
    endpoints: {
      auth: '/auth/login',
      products: '/api/products'
    }
  });
});

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.path 
  });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});