import Nav from "../../components/nav/Nav";
import { useParams } from "react-router-dom";
import ProductItem from "../products/product_item/ProductItem";
import Footer from "../../components/footer/Footer";
import { useEffect, useState } from "react";
import "./product.css";

const Product = (props) => {
  const params = useParams();
  const [productLoaded, setProductLoaded] = useState(false);
  const [currProduct, setCurrProduct] = useState({});
  const [variants, setVariants] = useState(null);
  const [qty, setQty] = useState(1);

  const handleVariantsChange = (e) => {
    setVariants((variants) => {
      const groupId = e.target.id;
      const optionId = e.target.value;
      const updatedVariants = { ...variants, [groupId]: optionId };
      return updatedVariants;
    });
  };

  const handleQtyChange = (e) => {
    const operation = e.target.textContent;
    if (operation === "+") {
      setQty((qty) => qty + 1);
    } else if (operation === "-") {
      if (qty > 1) {
        setQty((qty) => qty - 1);
      } else {
        return;
      }
    } else {
      console.log("There was an error changing the quantity");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    props.onAddToCart(currProduct.id, qty, variants);
  };

  const getTotalPrice = () => {
    const basePrice = currProduct.price.raw;
    let variantsPrice = 0;
    for (const key in variants) {
      const optionId = variants[key];
      currProduct.variant_groups.forEach((group) => {
        group.options.forEach((option) => {
          if (group.id === key && option.id === optionId) {
            variantsPrice += option.price.raw;
          }
        });
      });
    }
    return (basePrice + variantsPrice) * qty;
  };

  const renderProduct = () => {
    if (productLoaded) {
      return (
        <div>
          <ProductItem
            key={currProduct.id}
            product={currProduct}
            onAddToCart={props.onAddToCart}
          />

          <div className="product-about">
            <p className="h-sub">
              The F1 is a minimalist wallet made with the finest of full grain
              leathers. Handcrafted to fit your minimalist lifestyle and made to
              last.
            </p>
            <br />
            <p className="h-sub">Features:</p>
            <p className="h-sub">
              - Option of Machine Stitched or Hand Stitched with Japanese
              thread.
              <br />- Rose gold foiled logo on closure strap
              <br />- Hand finished dyed edges
            </p>
          </div>

          <br />

          <form className="product-form">
            {currProduct.variant_groups.map((group) => {
              return (
                <div key={group.id + "container"}>
                  <h2 className="h-main">{group.name}</h2>
                  <select
                    name={group.name}
                    key={group.id}
                    id={group.id}
                    value={variants[group.id]}
                    onChange={handleVariantsChange}
                  >
                    {group.options.map((variation) => {
                      return (
                        <option value={variation.id} key={variation.id}>
                          {variation.name + " ($" + variation.price.raw + ")"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
            <br />

            <div className="qtyCounter h-sub">
              <span onClick={handleQtyChange}>-</span>
              <span>{qty}</span>
              <span onClick={handleQtyChange}>+</span>
            </div>
            <br />

            <button onClick={handleAddToCart}>
              Add To Cart - ${getTotalPrice()} USD
            </button>
          </form>
        </div>
      );
    } else {
      return <p>No product found with that id</p>;
    }
  };

  useEffect(() => {
    if (props.products.length === 0) {
      return console.log("Products have not loaded yet.");
    }
    setProductLoaded(true);
    for (var i = 0; i < props.products.length; i++) {
      if (props.products[i].id === params.id) {
        // console.log(props.products[i]);
        const newProduct = props.products[i];
        setCurrProduct(newProduct);
        setVariants(() => {
          // console.log(newProduct);
          const tempVariant = {};
          newProduct.variant_groups.forEach((group) => {
            // console.log(group.id);
            tempVariant[group.id] = group.options[0].id;
          });
          // console.log(tempVariant);
          return tempVariant;
        });
      }
    }
    // }
    // );
  }, [props.products]);

  return (
    <main className="page-wrapper">
      <Nav cart={props.cart} />
      <div className="page-content">
        <section className="page-section">{renderProduct()}</section>
      </div>
      <Footer />
    </main>
  );
};

export default Product;
