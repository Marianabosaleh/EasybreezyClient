import React, { useState } from 'react';
import { addShoeProduct } from '../../firebase'; // Import the addShoeProduct function

const AddShoeForm: React.FC = () => {
  const [name, setName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addShoeProduct(name, imageSrc, description, parseFloat(price));
      // Clear form fields after adding shoe product
      setName('');
      setImageSrc('');
      setDescription('');
      setPrice('');
      setErrorMessage(''); // Reset error message
    } catch (error: any) { // Explicitly specify the type of 'error' as 'any'
      console.error('Error adding shoe product:', error.message);
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
        <button type="submit">Add Shoe</button> 
      </form>
    </div>
  );
};

export default AddShoeForm;
