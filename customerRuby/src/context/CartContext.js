import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    calculateTotal();
  }, [cartItems]);

  const calculateTotal = () => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const addToCart = (product) => {
    return new Promise((resolve) => {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.priceid === product.priceid);
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + (product.quantity || 1);
          let maxAvailable;
          
          // Handle viands
          if (product.productType === 'viands') {
            maxAvailable = product.availableQuantity;
            if (newQuantity > maxAvailable) {
              alert(`Sorry, only ${maxAvailable} servings available for ${product.name}`);
              resolve(false);
              return prevItems;
            }
            resolve(true);
            return prevItems.map(item =>
              item.priceid === product.priceid
                ? { 
                    ...item, 
                    quantity: newQuantity,
                    availableQuantity: maxAvailable
                  }
                : item
            );
          } 
          // Handle lechon (keeping original logic)
          else {
            maxAvailable = product.availableQuantity || product.quantity;
            if (newQuantity > maxAvailable) {
              alert(`Sorry, only ${maxAvailable} items available`);
              resolve(false);
              return prevItems;
            }
            resolve(true);
            return prevItems.map(item =>
              item.priceid === product.priceid
                ? { 
                    ...item, 
                    quantity: newQuantity,
                    maxQuantity: maxAvailable
                  }
                : item
            );
          }
        }

        // For new items
        if (product.productType === 'viands') {
          const availableQuantity = product.availableQuantity;
          if ((product.quantity || 1) > availableQuantity) {
            alert(`Sorry, only ${availableQuantity} servings available for ${product.name}`);
            resolve(false);
            return prevItems;
          }
          resolve(true);
          return [...prevItems, {
            ...product,
            quantity: product.quantity || 1,
            availableQuantity,
            imageUrl: product.imageSrc
          }];
        } else {
          // Original lechon logic for new items
          const isViand = !product.weight && product.quantity;
          const maxQuantity = isViand ? product.quantity : (product.availableQuantity || product.quantity);
          resolve(true);
          return [...prevItems, {
            ...product,
            quantity: product.quantity || 1,
            productType: isViand ? 'viands' : 'lechon',
            maxQuantity: maxQuantity,
            imageUrl: isViand ? product.imageSrc : product.imageUrl
          }];
        }
      });
    });
  };

  const updateQuantity = (priceid, newQuantity) => {
    return new Promise((resolve) => {
      setCartItems(prevItems => {
        const item = prevItems.find(item => item.priceid === priceid);
        if (!item || newQuantity < 1) {
          resolve(false);
          return prevItems;
        }

        // Handle viands
        if (item.productType === 'viands') {
          if (newQuantity > item.availableQuantity) {
            alert(`Sorry, only ${item.availableQuantity} servings available for ${item.name}`);
            resolve(false);
            return prevItems;
          }
          resolve(true);
          return prevItems.map(i =>
            i.priceid === priceid
              ? { ...i, quantity: newQuantity }
              : i
          );
        } 
        // Handle lechon (keeping original logic)
        else {
          const maxQuantity = item.maxQuantity;
          if (newQuantity > maxQuantity) {
            alert(`Sorry, only ${maxQuantity} items available`);
            resolve(false);
            return prevItems;
          }
          resolve(true);
          return prevItems.map(i =>
            i.priceid === priceid
              ? { ...i, quantity: newQuantity }
              : i
          );
        }
      });
    });
  };

  const removeFromCart = (priceid) => {
    setCartItems(prevItems => prevItems.filter(item => item.priceid !== priceid));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}