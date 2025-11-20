import { db } from '../config/firebase.config.js';

const COLLECTION_NAME = 'products';

class ProductModel {
  
  // Obtener todos los productos
  static async getAll() {
    try {
      const snapshot = await db.collection(COLLECTION_NAME).get();
      const products = [];
      
      snapshot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  // Obtener un producto por ID
  static async getById(id) {
    try {
      const doc = await db.collection(COLLECTION_NAME).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  // Crear un nuevo producto
  static async create(productData) {
    try {
      const docRef = await db.collection(COLLECTION_NAME).add({
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return {
        id: docRef.id,
        ...productData
      };
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  // Actualizar un producto
  static async update(id, productData) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      await docRef.update({
        ...productData,
        updatedAt: new Date().toISOString()
      });
      
      return {
        id,
        ...productData
      };
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  // Eliminar un producto
  static async delete(id) {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return false;
      }
      
      await docRef.delete();
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }
}

export default ProductModel;