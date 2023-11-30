// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Add a new review to a product
router.post('/api/products/:productId/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.reviews.push(req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve all reviews for a specific product with pagination
router.get('/api/products/:productId/reviews', async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const product = await Product.findById(req.params.productId)
      .select('reviews')
      .slice('reviews', (page - 1) * pageSize, pageSize);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a review by ID within a product
router.put('/api/products/:productId/reviews/:reviewId', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId, 'reviews._id': req.params.reviewId },
      {
        $set: {
          'reviews.$.content': req.body.content,
          'reviews.$.rating': req.body.rating,
        },
      },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a review by ID within a product
router.delete('/api/products/:productId/reviews/:reviewId', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { $pull: { reviews: { _id: req.params.reviewId } } },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
