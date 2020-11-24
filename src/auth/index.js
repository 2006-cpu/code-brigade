export function storeCurrentCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  };
  
  export function getCurrentCart() {
    const getToken = JSON.parse(localStorage.getItem('cart'));
    return getToken;
  };
  
  export function clearCurrentCart() {
    localStorage.removeItem('cart');
  };