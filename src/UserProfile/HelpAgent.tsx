import React from 'react';
import { FaHome } from 'react-icons/fa';
import './helper.css'
const NeedHelpAgent: React.FC = () => {
  function goToHomePage() {
    // Perform redirection here
    window.location.href = '/HomePage'; 
  }
  return (
    <div className="container">
      <h1>Need Help ? </h1>
      <section>
        <h2>Support Agents</h2>
        <p>
          Welcome Agent ! Here's how you can manage products and view client orders:
        </p>

        <h3>Add Products to the Shop</h3>
        <ol>
          <li>
            Click on the "Add Product" button.
          </li>
          <li>
            Fill in the required product details, including name, description, price, and image.
          </li>
          <li>
            Click "Save" to add the product to the shop.
          </li>
        </ol>

        <h3>Remove Products from the Shop</h3>
        <ol>
          <li>
            Locate the product you want to remove.
          </li>
          <li>
            Click on the "Remove"  option next to the product.
          </li>
          <li>
            Confirm the action, and the product will be removed from the shop.
          </li>
        </ol>

        <h3>View Client Orders</h3>
        <ol>
          <li>
          You should see a list of recent orders with details like order ID, customer name, and order status.
          </li>
          <li>
            Click on a specific order to view more details, including the list of products, customer information, and order status.
          </li>
        </ol>

        <p>
          If you encounter any issues or need additional assistance, please contact the technical support team.
        </p>
        <br/>
        <h2>
          *to reset your email/password contact us EasyBreezy@gmail.com*
        </h2>
      </section>
    </div>

  );
};
export default NeedHelpAgent;
