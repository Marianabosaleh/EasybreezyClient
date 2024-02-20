import React from 'react';
import { IoList } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { MdOutlineAddHome , MdPayment} from "react-icons/md";

class App extends React.Component {
  handleButtonClick = (buttonId :string) => {
    switch (buttonId) {
      case 'myOrders':
        // Logic for My Orders button
        console.log('My Orders clicked');
        break;
      case 'myDetails':
        // Logic for My Details button
        console.log('My Details clicked');
        break;
      case 'myAddress':
        // Logic for My Address button
        console.log('My Address clicked');
        break;
      case 'payment':
        // Logic for Payment button
        console.log('Payment clicked');
        break;
      default:
        console.log('Unknown button clicked');
    }
  };

  render() {
    return (
      <div>
        <header>
          <h1>Hello, [Name]</h1>
        </header>

        <button onClick={() => this.handleButtonClick('myOrders')}>
        <IoList className='My Orders'/>
        </button>

        <button onClick={() => this.handleButtonClick('myDetails')}>
        <ImProfile className='My Details'/>
        </button>

        <button onClick={() => this.handleButtonClick('myAddress')}>
        <MdOutlineAddHome className='my Address'/>
        </button>

        <button onClick={() => this.handleButtonClick('payment')}>
        <MdPayment className='Payment' />
        </button>
      </div>
    );
  }
}

export default App;
