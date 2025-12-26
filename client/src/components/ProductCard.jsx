import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  if (!product) return null;

  // Pseudo-random but stable rating (3–5) when product.rating is missing or 0
  const getDisplayRating = () => {
    if (product.rating && product.rating > 0) return product.rating;

    const key = (product._id || product.name || "").toString();
    if (!key) return 4; // sensible default

    let hash = 0;
    for (let i = 0; i < key.length; i += 1) {
      hash = (hash * 31 + key.charCodeAt(i)) & 0xffffffff;
    }

    const rating = (Math.abs(hash) % 3) + 3; // 3, 4, or 5
    return rating;
  };

  const displayRating = getDisplayRating();

  return (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full"
    >
      {/* Product Image */}
      <div className="group cursor-pointer flex items-center justify-center px-2">
        <img
          className="group-hover:scale-105 transition max-w-26 md:max-w-36"
          src={product.images?.[0] || "/fallback.png"}
          alt={product.name}
        />
      </div>

      {/* Product Details */}
      <div className="text-gray-500/60 text-sm">
        <p>{product.category}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>

        {/* Product Rating */}
        <div className="flex items-center gap-0.5">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                className="md:w-3.5 w-3"
                src={i < Math.floor(displayRating) ? assets.star_icon : assets.star_dull_icon}
                alt=""
              />
            ))}
          <p>({displayRating})</p>
        </div>

        {/* Price + Cart Controls */}
        <div className="flex items-end justify-between mt-3">
          <p className="md:text-xl text-base font-medium text-primary">
            {currency}{product.offerPrice}{" "}
            <span className="text-gray-500/60 md:text-sm text-xs line-through">
              {currency}{product.price}
            </span>
          </p>

          {/* Cart Section (Click prevented from bubbling up to card nav) */}
          <div onClick={(e) => e.stopPropagation()} className="text-primary-500">
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary-100 border border-primary-300 
                md:w-[80px] w-[64px] h-[34px] rounded text-primary font-medium cursor-pointer"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} alt="cart_icon" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary-500/25 rounded select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  aria-label="Remove item"
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">{cartItems[product._id]}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  aria-label="Add item"
                  className="cursor-pointer text-md px-2 h-full"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
