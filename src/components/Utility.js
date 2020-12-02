const theTotal = (cart) => {
    let cartTotal = 0;
        cart.forEach(productItem => {
            cartTotal += productItem.price * productItem.quantity       
        })
        return cartTotal
}

export default theTotal;