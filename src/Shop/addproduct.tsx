import React, { useState } from 'react';
import { addProduct } from '../firebase';

interface AddProductFormProps {
  shopId: string;
  categoryName?: string; 
}
  
  const AddProductForm: React.FC<AddProductFormProps> = ({ shopId, categoryName }) => {
  const [name, setName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  // Use categoryName directly if provided, otherwise allow selection
  const [selectedCategory, setSelectedCategory] = useState(categoryName || '');
  const categories = ['tops', 'bottoms', 'shoes', 'accessories'];
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateForm = () => {
    const validatedPrice = parseFloat(price);
    if (!name || !imageSrc || !description || price === '' || isNaN(validatedPrice) || validatedPrice <= 0 || !selectedCategory) {
      setErrorMessage("All product details must be provided and price must be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop the form submission if validation fails
    }

    try {
      // Log the submission attempt for debugging
      console.log(`Submitting product:`, { name, imageSrc, description, price: parseFloat(price), categoryName: selectedCategory, shopId });
      
      // Correctly pass parameters to the addProduct function
      await addProduct(name, imageSrc, description, parseFloat(price), selectedCategory, shopId);

      // Reset form fields upon successful addition
      setName('');
      setImageSrc('');
      setDescription('');
      setPrice('');
      setSelectedCategory(categoryName || ''); // Reset or keep the category if predefined
      setErrorMessage('');
    } catch (error: unknown) {
      let errMsg = 'An unexpected error occurred';
      if (error instanceof Error) {
        errMsg = error.message;
      }
      console.error(`Error adding product:`, errMsg);
      setErrorMessage(errMsg);
    }
  };

  return (
    <div>
      {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="url" placeholder="Image URL" value={imageSrc} onChange={e => setImageSrc(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
        {!categoryName && (
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
