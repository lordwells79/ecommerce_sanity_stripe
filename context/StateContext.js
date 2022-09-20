import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;
  let checkProductInCart;
  let indexProductInCart;
  let index;

  const onAdd = (product, quantity) => {
    if (cartItems.length > 0) {
      checkProductInCart = cartItems.find((item) => item._id === product._id);
      indexProductInCart = cartItems.findIndex(
        (item) => item._id === product._id
      );

      if (checkProductInCart) {
        // const updateCartItems = cartItems.map((cartProduct) => {
        //   if (cartProduct._id === product.id)
        //     return {
        //       ...cartProduct,
        //       quantity: cartProduct.quantity + quantity,
        //     };
        // });
        checkProductInCart.quantity += quantity;
        cartItems[indexProductInCart] = checkProductInCart;
        setCartItems(cartItems);
      } else {
        product.quantity = quantity;
        setCartItems([...cartItems, { ...product }]);
      }
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }

    //console.log("CheckP --> ", checkProductInCart);

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantity) => prevTotalQuantity + quantity);

    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItems(newCartItems);
  };

  const toggleCartItemQuanitity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    const newCartItem = cartItems.filter((item) => item._id !== id);

    if (value === "inc") {
      //console.log(cartItems[index]);
      foundProduct.quantity++;

      cartItems[index] = foundProduct;

      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantityn) => prevTotalQuantityn + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        foundProduct.quantity--;
        cartItems[index] = foundProduct;
        // setCartItems([
        //   ...newCartItem,
        //   { ...foundProduct, quantity: foundProduct.quantity - 1 },
        // ]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantityn) => prevTotalQuantityn - 1);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };
  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };
  const resetQty = () => {
    setQty(1);
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        setQty,
        incQty,
        decQty,
        resetQty,
        onAdd,
        toggleCartItemQuanitity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export const useStateContext = () => useContext(Context);
