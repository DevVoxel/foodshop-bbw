import Modal from './UI/Modal';
import { useContext } from 'react';
import { CartContext } from '../store/CartContext';
import { currencyFormatter } from '../util/formatting';
import Button from './UI/Button';

export default function Cart({ onClose }) {
  const cartCtx = useContext(CartContext);

  const cartTotal = cartCtx.items.reduce(
    (total, item) => total + item.quantity * parseFloat(item.price),
    0
  );

  async function handleCheckout() {
    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: {
            items: cartCtx.items,
            customer: {
              email: 'test@example.com',
              name: 'Test User',
              street: '123 Test St',
              'postal-code': '12345',
              city: 'Test City',
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      // Clear cart and close modal after successful order
      cartCtx.clearCart();
      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  }

  return (
    <Modal className="cart" open onClose={onClose}>
      <h2>Your Cart</h2>
      {cartCtx.items.length === 0 && <p>No items in cart!</p>}
      {cartCtx.items.length > 0 && (
        <>
          <ul>
            {cartCtx.items.map((item) => (
              <li key={item.id} className="cart-item">
                <p>
                  {item.name} - {item.quantity} x {currencyFormatter.format(item.price)}
                </p>
                <p className="cart-item-actions">
                  <button onClick={() => cartCtx.removeItem(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => cartCtx.addItem(item)}>+</button>
                </p>
              </li>
            ))}
          </ul>
          <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
          <p className="modal-actions">
            <Button onClick={handleCheckout}>Checkout</Button>
          </p>
        </>
      )}
      <p className="modal-actions">
        <Button textOnly onClick={onClose}>
          Close
        </Button>
      </p>
    </Modal>
  );
}
