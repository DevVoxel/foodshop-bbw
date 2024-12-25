import { createContext, useState } from 'react';

export const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});
export function CartContextProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(item) {
    setItems((prevItems) => {
      const existingCartItemIndex = prevItems.findIndex(
        (i) => i.id === item.id
      );
      if (existingCartItemIndex > -1) {
        const updatedItems = [...prevItems];
        const existingItem = prevItems[existingCartItemIndex];
        updatedItems[existingCartItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
        };
        return updatedItems;
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  }
  function removeItem(id) {
    setItems((prevItems) => {
      const existingCartItemIndex = prevItems.findIndex(
        (item) => item.id === id
      );
      const existingItem = prevItems[existingCartItemIndex];

      if (existingItem.quantity === 1) {
        return prevItems.filter(item => item.id !== id);
      }

      const updatedItems = [...prevItems];
      updatedItems[existingCartItemIndex] = {
        ...existingItem,
        quantity: existingItem.quantity - 1,
      };
      return updatedItems;
    });
  }

  function clearCart() {
    setItems([]);
  }
  const cartContext = {
    items,
    addItem,
    removeItem,
    clearCart,
  };
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}
