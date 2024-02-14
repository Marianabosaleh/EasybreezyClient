import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for type checking
import { addProduct } from '../firebase'; // Import the addProduct function

interface AddProductFormProps {
  categoryName: 'tops' | 'bottoms' | 'shoes' | 'accessories';
}

const AddProductForm: React.FC<AddProductFormProps> = ({ categoryName }) => {
  const [name, setName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'tops' | 'bottoms' | 'shoes' | 'accessories'>(categoryName); // Specify type here
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log("Category Name:", categoryName); // Log categoryName to verify it's not empty
    try {
      await addProduct(name, imageSrc, description, parseFloat(price), selectedCategory);
      // Clear form fields after adding product
      setName('');
      setImageSrc('');
      setDescription('');
      setPrice('');
      setErrorMessage(''); // Reset error message
    } catch (error: any) { // Explicitly specify the type of 'error' as 'any'
      console.error(`Error adding ${selectedCategory} product:`, error.message);
      setErrorMessage(error.message || 'An error occurred'); // Set error message
    }
  };

  return (
    <div>
      {errorMessage && <p>{errorMessage}</p>} {/* Display error message if it exists */}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="url" placeholder="Image URL" value={imageSrc} onChange={e => setImageSrc(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        {/* Include a dropdown/select input for selecting the category */}
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
