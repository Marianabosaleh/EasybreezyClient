import React, { useState } from 'react';
import { addProduct } from '../firebase';

const AddProductForm: React.FC = () => {
  const [name, setName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateForm = () => {
    const validatedPrice = parseFloat(price);
    if (!name || !imageSrc || !description || !price || isNaN(validatedPrice) || validatedPrice <= 0 || !selectedCategory) {
      setErrorMessage("All product details must be provided and price must be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await addProduct(name, imageSrc, description, parseFloat(price), selectedCategory);
      console.log("Product added successfully.");

      // Reset form fields upon successful addition
      setName('');
      setImageSrc('');
      setDescription('');
      setPrice('');
      setSelectedCategory('');
      setErrorMessage('');
    } catch (error: any) {
      console.error("Error adding product:", error.message);
      setErrorMessage("Error adding product. Please try again.");
    }
  };

  return (
    <div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="url" placeholder="Image URL" value={imageSrc} onChange={(e) => setImageSrc(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="text" placeholder="Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
