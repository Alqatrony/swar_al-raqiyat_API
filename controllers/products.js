const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  const newProduct = new Product({
    name,
    description,
    price,
    imageUrl
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating new product", error });
  }
};

// Get a single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving product', error });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  console.log('Request ID:', id); // Add console log for the ID
  console.log('Request updates:', updates); // Add console log for the updates

  try {
    const product = await Product.findById(id);

    console.log('Found product:', product); // Add console log for the found product

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Update the product properties
    Object.assign(product, updates);

    // Save the updated product
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    await Product.deleteOne({ _id: id }); // Use deleteOne instead of remove
    res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Error deleting product", error });
  }
};