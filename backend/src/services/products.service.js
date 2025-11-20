import ProductModel from '../models/product.model.js';

class ProductService {
  
  async getAllProducts() {
    try {
      return await ProductModel.getAll();
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.getById(id);
      
      if (!product) {
        const error = new Error('Producto no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(productData) {
    try {
      // Validar datos requeridos
      if (!productData.name || !productData.price) {
        const error = new Error('Nombre y precio son requeridos');
        error.statusCode = 400;
        throw error;
      }
      
      return await ProductModel.create(productData);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const product = await ProductModel.update(id, productData);
      
      if (!product) {
        const error = new Error('Producto no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await ProductModel.delete(id);
      
      if (!deleted) {
        const error = new Error('Producto no encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();