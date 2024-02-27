import React, { useState } from 'react';
import './styleS.css';
import { getFirestore, collection, query, getDocs, DocumentData } from 'firebase/firestore';
import CartHandler from '../Categories/carthandler';
import FavoritesHandler from '../Categories/favoriteshandler';
import IconNav from '../components/iconNav';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageSrc: string;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setMatchingProducts([]);
      return; // If the search term is empty, clear the displayed products
    }

    const firestore = getFirestore();
    const filteredProducts: Product[] = [];
    const categories = ['shoes', 'bottoms', 'tops', 'accessories'];

    for (const category of categories) {
      const q = query(collection(firestore, category));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const productData: DocumentData = doc.data();
        if (productData.name.toLowerCase().includes(term.trim().toLowerCase())) {
          filteredProducts.push({
            id: doc.id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            imageSrc: productData.imageSrc,
          });
        }
      });
    }

    setMatchingProducts(filteredProducts);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="search-page-container">
      <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(searchTerm); }}>
        <input
          type="text"
          placeholder="Enter your search term"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          id="searchTerm"
          name="searchTerm"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className="matching-products">
        {matchingProducts.map((product, index) => (
          <div key={index} className="product" onClick={() => handleProductSelect(product)}>
            <img src={product.imageSrc} alt={product.name} style={{ width: '200px', height: 'auto' }} />
            <p>{product.name}</p>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <div className="cartAndFav">
              <CartHandler product={selectedProduct} />
              <FavoritesHandler product={selectedProduct} />
           </div>
          </div>
        ))}
      </div>
      <IconNav />
    </div>
  );
};

export default SearchPage;
