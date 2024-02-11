// FavoritesPage.tsx
import React from 'react';
import './FavoritesPage.css'; // Import the CSS file

interface FavoriteItem {
  name: string;
  price: number;
}

const FavoritesPage: React.FC<{ favorites: FavoriteItem[] | undefined; removeFromFavorites: (index: number) => void }> = ({ favorites, removeFromFavorites }) => {
  return (
    <div className="favorites-page">
      <h1>Favorites</h1>
      <ul className="favorites-list">
        {favorites && favorites.map((item, index) => (
          <li key={index} className="favorite-item">
            <div className="favorite-details">
              <span className="favorite-name">{item.name}</span>
              <span className="favorite-price">${item.price}</span>
            </div>
            <button className="favorite-button" onClick={() => removeFromFavorites(index)}>Remove</button>
          </li>
        ))}
      </ul>
      {/* You can add more content or styling here */}
    </div>
  );
};

export default FavoritesPage;
