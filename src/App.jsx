import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./routes/home/Home";
import About from "./routes/about/About";
import Products from "./routes/products/Products";
import Cart from "./routes/cart/Cart";
import Checkout from "./routes/checkout/Checkout";
import Confirmation from "./routes/confirmation/Confirmation";
import commerce from "./lib/commerce";

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = () => {
    commerce.products
      .list()
      .then((products) => {
        setProducts(products.data);
        console.log("Products updated successfully.");
        setLoading(false);
      })
      .catch((error) => {
        console.log("There was an error fetching the products", error);
      });
  };

  const fetchCart = () => {
    commerce.cart
      .retrieve()
      .then((cart) => {
        setCart(cart);
      })
      .catch((error) => {
        console.log("There was an error fetching the cart", error);
      });
  };

  const handleAddToCart = (productId, quantity) => {
    commerce.cart
      .add(productId, quantity)
      .then((item) => {
        setCart(item.cart);
      })
      .catch((error) => {
        console.error("There was an error adding the item to the cart", error);
      });
  };

  const handleUpdateCartQty = (lineItemId, quantity) => {
    commerce.cart
      .update(lineItemId, { quantity })
      .then((resp) => {
        setCart(resp.cart);
      })
      .catch((error) => {
        console.log("There was an error updating the cart items", error);
      });
  };

  const handleRemoveFromCart = (lineItemId) => {
    commerce.cart
      .remove(lineItemId)
      .then((resp) => {
        setCart(resp.cart);
      })
      .catch((error) => {
        console.error(
          "There was an error removing the item from the cart",
          error
        );
      });
  };

  const handleEmptyCart = () => {
    commerce.cart
      .empty()
      .then((resp) => {
        setCart(resp.cart);
      })
      .catch((error) => {
        console.error("There was an error emptying the cart", error);
      });
  };

  const refreshCart = () => {
    commerce.cart
      .refresh()
      .then((newCart) => {
        setCart(newCart);
      })
      .catch((error) => {
        console.log("There was an error refreshing your cart", error);
      });
  };

  const handleCaptureCheckout = (checkoutTokenId, newOrder) => {
    commerce.checkout
      .capture(checkoutTokenId, newOrder)
      .then((order) => {
        // Save the order into state
        setOrder(order);
        // Clear the cart
        refreshCart();
        // Send the user to the receipt
        navigate("/confirmation");
        // Store the order in session storage so we can show it again if the
        // user refreshes the page!
        window.sessionStorage.setItem("order_receipt", JSON.stringify(order));
      })
      .catch((error) => {
        console.log("There was an error confirming your order", error);
      });
  };

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/" element={<Home products={products} />} />
        <Route path="about" element={<About />} />
        <Route
          path="products"
          element={
            <Products
              products={products}
              onAddToCart={handleAddToCart}
              fetchProducts={fetchProducts}
              loading={loading}
            />
          }
        />
        <Route
          path="cart"
          element={
            <Cart
              cart={cart}
              fetchCart={fetchCart}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveFromCart={handleRemoveFromCart}
              onEmptyCart={handleEmptyCart}
            />
          }
        />
        <Route
          path="checkout"
          element={
            <Checkout
              cart={cart}
              fetchCart={fetchCart}
              onCaptureCheckout={handleCaptureCheckout}
            />
          }
        />
        <Route
          path="confirmation"
          element={
            <Confirmation
              order={order}
              onBackToHome={() =>
                window.localStorage.removeItem("order_receipt")
              }
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
