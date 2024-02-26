import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ProductFormProps {
  onSubmit: (productData: any) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [productData, setProductData] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    imageSrc: '',
    selectedCategory: 'tops',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a random UUID for the id field
    const randomId = uuidv4();
    onSubmit({ ...productData, id: randomId });

    // Reset form fields
    setProductData({
      id: '',
      name: '',
      price: '',
      description: '',
      imageSrc: '',
      selectedCategory: 'tops',
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="id" placeholder="Product Id" value={productData.id} onChange={handleChange} disabled />
      <input type="text" name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} />
      <input type="text" name="price" placeholder="Price" value={productData.price} onChange={handleChange} />
      <input type="text" name="description" placeholder="Description" value={productData.description} onChange={handleChange} />
      <input type="text" name="imageSrc" placeholder="Image URL" value={productData.imageSrc} onChange={handleChange} />
      <select name="selectedCategory" value={productData.selectedCategory} onChange={handleChange}>
        <option value="tops">Tops</option>
        <option value="bottoms">Bottoms</option>
        <option value="shoes">Shoes</option>
        <option value="accessories">Accessories</option>
      </select>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
