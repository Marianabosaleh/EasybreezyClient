import React, { useEffect, useState } from 'react';

const ShoesPage = () => {
  const [product, setProduct] = useState<{ name: string; description: string; price: string } | null>(null);

  useEffect(() => {
    fetch('/scrape')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        setProduct(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      {/* Render the scraped product data */}
      {product ? (
        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ShoesPage;
