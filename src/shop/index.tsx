import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addProduct } from '../firebase';

interface AddProductFormProps {
  categoryName: 'tops' | 'bottoms' | 'shoes' | 'accessories';
  shopName: string | undefined; // Update shopName type to allow for undefined
}

const AddProductForm: React.FC<AddProductFormProps> = ({ categoryName, shopName }) => {
  const [name, setName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'tops' | 'bottoms' | 'shoes' | 'accessories'>(categoryName);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!shopName) {
        throw new Error('Shop name is undefined.'); // Throw an error if shopName is undefined
      }
      await addProduct(name, imageSrc, description, parseFloat(price), selectedCategory, shopName);
      setName('');
      setImageSrc('');
      setDescription('');
      setPrice('');
      setErrorMessage('');
    } catch (error: any) {
      console.error(`Error adding ${selectedCategory} product:`, error.message);
      setErrorMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="url" placeholder="Image URL" value={imageSrc} onChange={e => setImageSrc(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as 'tops' | 'bottoms' | 'shoes' | 'accessories')} required>
          <option value="tops">Tops</option>
          <option value="bottoms">Bottoms</option>
          <option value="shoes">Shoes</option>
          <option value="accessories">Accessories</option>
        </select>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
