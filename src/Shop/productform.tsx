import React, { useState } from 'react';

const ProductForm: React.FC<{ onSubmit: (productData: any) => void }> = ({ onSubmit }) => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    imageSrc: '',
    // Add other fields as needed
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(productData);
    // Optionally reset form or provide feedback
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Product Name" value={productData.name} onChange={handleChange} />
      <input type="text" name="price" placeholder="Price" value={productData.price} onChange={handleChange} />
      <input type="text" name="description" placeholder="Description" value={productData.description} onChange={handleChange} />
      <input type="text" name="imageSrc" placeholder="Image URL" value={productData.imageSrc} onChange={handleChange} />
      {/* Add more fields as necessary */}
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
