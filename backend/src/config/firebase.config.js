import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

try {
  // Opción 1: Leer el archivo JSON usando fs (RECOMENDADO)
  const serviceAccountPath = join(__dirname, 'firebase-credentials.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  db = admin.firestore();
  console.log('✅ Firebase conectado exitosamente');
  
} catch (error) {
  console.error('❌ Error al conectar Firebase:', error.message);
  console.log('⚠️  Continuando sin Firebase - usa credenciales válidas para producción');
}

export { db, admin };