import ProductService from '../services/products.service.js';

class ProductController {
  
  async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      res.json(product);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = req.body;
      const product = await ProductService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      const product = await ProductService.updateProduct(id, productData);
      res.json(product);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductService.deleteProduct(id);
      res.json(result);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
}

export default new ProductController();