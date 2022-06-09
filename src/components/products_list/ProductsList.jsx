import React from "react";
import PropTypes from "prop-types";
import ProductItem from "../product_item/ProductItem";
import "./products-list.css";

const ProductsList = ({ products }) => {
  return (
    <div className="products" id="products">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

ProductsList.propTypes = {
  products: PropTypes.array,
};

export default ProductsList;
