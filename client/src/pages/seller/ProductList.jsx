import React from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ProductList = () => {
  const { products, currency, axios, fetchProducts, setProducts } = useAppContext();

  const toggleStock = async(id, inStock) => {
    try {
      const {data} = await axios.post('/api/product/stock',
         {id, inStock})
      if(data.success) {
        // Update local state immediately
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === id ? { ...product, inStock } : product
          )
        );
        fetchProducts(); // Refresh product list after stock change
        toast.success(data.message || "Stock status updated");
      } else {
        toast.error(data.message || "Failed to update stock status");
      }

    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
                <th className="px-4 py-3 font-semibold truncate text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded overflow-hidden">
                      <img
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : "/fallback.png" // fallback image
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <span className="truncate max-sm:hidden w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {currency}{product.offerPrice}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        onChange={() => toggleStock(product._id,
                           !product.inStock)} checked={product.inStock}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200 relative">
                        <div className="dot absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                      </div>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm(`Delete product "${product.name}"?`)) return;
                        try {
                          const { data } = await axios.delete(`/api/product/${product._id}`);
                          if (data.success) {
                            setProducts(prev => prev.filter(p => p._id !== product._id));
                            toast.success(data.message || "Product deleted");
                          } else {
                            toast.error(data.message || "Failed to delete product");
                          }
                        } catch (error) {
                          toast.error(error.message);
                        }
                      }}
                      className="cursor-pointer px-3 py-1.5 text-xs md:text-sm bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductList;