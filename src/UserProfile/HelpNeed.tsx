import React from 'react';

const NeedHelpPage: React.FC = () => {
  return (
    <div>
      <h1>Need Help ? </h1>
      <section>
        <h2>Ordering Process</h2>
        <h3>Dear Client</h3>
        <p>Follow these steps to place an order:</p>
        <ol>
          <li>Choose products and add them to your cart.</li>
          <li>Proceed to checkout and provide shipping details.</li>
          <li>Confirm your order and make payment.</li>
        </ol>
        <p>Once completed, you'll receive an order confirmation , Have A Nice Day !</p>
      </section>

      {/* Add other sections as needed, following the structure above */}

    </div>
  );
};

export default NeedHelpPage;
