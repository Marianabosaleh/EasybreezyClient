import React, { useState } from 'react';
import { addProduct } from '../firebase';

interface AddProductFormProps {
  shopName: string;
  categoryName?: string; // Optional prop for a predetermined category
}

const AddProductForm: React.FC<AddProductFormProps> = ({ shopName, categoryName }) => {
  const [name, setName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryName || ''); // Default to categoryName if provided
  // Directly define the categories instead of fetching from Firestore
  const categories = ['tops', 'bottoms', 'shoes', 'accessories'];
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Additional check to ensure shopName and selectedCategory are not empty
    if (!selectedCategory || !shopName) {
      console.error("Selected category or shop name is undefined.");
      setErrorMessage("Selected category or shop name is undefined. Please select a valid category and ensure shop name is provided.");
      return;
    }
  
    try {
      await addProduct(name, imageSrc, description, parseFloat(price), selectedCategory, shopName);
      // Reset form fields after successful addition
      setName('');
      setImageSrc('');
      setDescription('');
      setPrice('');
      setSelectedCategory(categoryName || ''); // Reset to the initial state or keep the category if predefined
      setErrorMessage('');
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error(`Error adding product:`, errorMessage);
      setErrorMessage(errorMessage);
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
        {categoryName ? (
          <p>Category: {selectedCategory}</p> // Display category name if predefined
        ) : (
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        )}
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
