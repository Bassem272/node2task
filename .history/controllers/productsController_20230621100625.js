import fetch from 'node-fetch';
import productsModel from '../models/productsModel.js';

export default {
  async getAllProducts(req, res) {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      productsModel.setProducts(data);
      res.json(productsModel.getProducts());
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  },

  getProductById(req, res) {
    const id = parseInt(req.params.id);
    const product = productsModel.getProductById(id);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product);
    }
  },

  createProduct(req, res) {

    try {
      productsModel.validate1(req.body); 
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
    const { title, price, description, categoryId, images } = req.body;

    const newProduct = {
      id: productsModel.getProducts().length + 1,
      title,
      price,
      description,
      category: {
        id: categoryId,
        name: 'Clothes',
        image: 'https://api.lorem.space/image/fashion?w=640&h=480&r=4278',
        creationAt: new Date(),
        updatedAt: new Date()
      },
      images,
      creationAt: new Date(),
      updatedAt: new Date()
    };

    productsModel.addProduct(newProduct);

    res.status(201).json(newProduct);
  },

  updateProduct(req, res) {

    try {
      productsModel.validate1(req.body); 
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
    const id = parseInt(req.params.id);
    const { title, price } = req.body;

    const updatedProduct = productsModel.updateProduct(id, { title, price });

    if (!updatedProduct) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(updatedProduct);
    }
  },

  deleteProduct(req, res) {
    const id = parseInt(req.params.id);

    const deletedProduct = productsModel.deleteProduct(id);

    if (!deletedProduct) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(true);
    }
  }
};
