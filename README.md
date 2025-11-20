# 🛒 Sistema de Gestión de Productos

Sistema completo de gestión de productos con autenticación JWT, desarrollado con Node.js, Express, Firebase y React + TypeScript. Este proyecto forma parte del proyecto final del curso de NodeJS brindado por talento tech.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ CRUD completo de productos
- ✅ Base de datos Firebase Firestore
- ✅ Frontend en React + TypeScript
- ✅ Alertas con SweetAlert2
- ✅ Diseño responsive

## 🛠️ Tecnologías

**Backend:**
- Node.js
- Express
- Firebase Admin SDK
- JWT

**Frontend:**
- React
- TypeScript
- SweetAlert2

## 📦 Instalación

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## ⚙️ Configuración

1. Crear archivo `.env` en la raíz con:
```env
PORT=3000
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=24h
TEST_USER_EMAIL=admin@test.com
TEST_USER_PASSWORD=admin123
```

2. Descargar credenciales de Firebase y guardarlas en `backend/src/config/firebase-credentials.json`

## 🚀 Uso

### Iniciar Backend
```bash
cd backend
npm run dev
```

### Iniciar Frontend
```bash
cd frontend
npm start
```
