import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

const LetchonModal = ({ 
  isVisible, 
  onClose, 
  type
}) => {
  const [priceData, setPriceData] = useState([]);
  const [tossAnimation, setTossAnimation] = useState({ isAnimating: false, itemId: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/lechon-products');
        const data = await response.json();
        
        const filteredPrices = data
          .filter(product => product.name.toLowerCase() === type)
          .map(product => ({
            priceid: product.productid,
            productid: product.productid,
            weight: product.weight,
            price: product.price,
            description: product.description,
            imageUrl: product.imageUrl,
            productName: product.name,
            quantity: product.quantity
          }));
        
        setPriceData(filteredPrices);
        
        const initialQuantities = {};
        filteredPrices.forEach(item => {
          initialQuantities[item.priceid] = 0;
        });
        setQuantities(initialQuantities);
        
        if (filteredPrices.length > 0) {
          setSelectedImage(filteredPrices[0].imageUrl);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isVisible && type) {
      fetchPrices();
    } else {
      setSelectedImage(null);
      setQuantities({});
    }
  }, [isVisible, type]);

  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === 'wrapper') onClose();
  };

  const handleRowClick = (imageUrl, e) => {
    // Check if the click was on the quantity controls or add to cart button
    if (e.target.closest('button') || e.target.closest('td:last-child')) {
      return;
    }
    setSelectedImage(imageUrl);
  };

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => {
      const currentItem = priceData.find(item => item.priceid === itemId);
      const newQuantity = Math.max(0, Math.min(prev[itemId] + change, currentItem.quantity));
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const handleAddToCart = async (item) => {
    const quantity = quantities[item.priceid];
    if (quantity === 0) {
      alert('Please select a quantity first');
      return;
    }

    const orderData = {
      priceid: item.priceid,
      productid: item.productid,
      name: item.productName,
      price: item.price,
      weight: item.weight,
      description: item.description,
      imageUrl: item.imageUrl,
      quantity: quantity
    };

    const success = await addToCart(orderData);
    
    if (success) {
      setTossAnimation({ isAnimating: true, itemId: item.priceid });
      setTimeout(() => {
        setTossAnimation({ isAnimating: false, itemId: null });
        alert(`Added ${quantity} ${orderData.name} to cart!`);
        onClose();
      }, 800);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="w-[900px] flex flex-col">
        <button 
          className="text-white text-xl place-self-end hover:text-orange-500 px-4 py-2" 
          onClick={onClose}
        >
          X
        </button>
        <div className="p-8 bg-gray-300 rounded-lg shadow-xl relative">
          <h3 className="text-1xl font-bold text-gray-800 mb-6 text-center">Price List</h3>

          <div className="flex gap-8">
            {/* Image section for Lechon Baboy (left side) */}
            {type === 'baboy' && selectedImage && (
              <div className="w-64 flex flex-col gap-4">
                <div className="h-64 relative">
                  <Image
                    src={selectedImage}
                    alt="Selected Lechon"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                {priceData.find(item => item.imageUrl === selectedImage) && (
                  <div className="text-center text-gray-700">
                    Available: {priceData.find(item => item.imageUrl === selectedImage).quantity} pieces
                  </div>
                )}
              </div>
            )}

            {/* Table section */}
            <div className="flex-grow">
              <table className="table-auto border-collapse w-full text-left text-gray-700 rounded-lg overflow-hidden shadow-md">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                    <th className="py-3 px-6 border-b">Weight</th>
                    <th className="py-3 px-6 border-b">Description</th>
                    <th className="py-3 px-6 border-b">Price</th>
                    <th className="py-3 px-6 border-b">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {priceData.map((item) => (
                    <tr 
                      key={item.priceid} 
                      className="hover:bg-orange-50 transition duration-200 cursor-pointer"
                      onClick={(e) => handleRowClick(item.imageUrl, e)}
                    >
                      <td className="py-3 px-6 border-b">{item.weight}</td>
                      <td className="py-3 px-6 border-b">{item.description}</td>
                      <td className="py-3 px-6 border-b">₱{item.price.toFixed(2)}</td>
                      <td className="py-3 px-6 border-b">
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-2 rounded disabled:opacity-50"
                            onClick={() => handleQuantityChange(item.priceid, -1)}
                            disabled={quantities[item.priceid] <= 0}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{quantities[item.priceid] || 0}</span>
                          <button
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-2 rounded disabled:opacity-50"
                            onClick={() => handleQuantityChange(item.priceid, 1)}
                            disabled={quantities[item.priceid] >= item.quantity}
                          >
                            +
                          </button>
                          <motion.button
                            className="bg-orange-500 hover:bg-[#f7c18e] text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 ml-2"
                            onClick={() => handleAddToCart(item)}
                            whileTap={{ scale: 0.95 }}
                            animate={
                              tossAnimation.isAnimating && tossAnimation.itemId === item.priceid
                                ? {
                                    y: [-20, -60, -20],
                                    x: [0, 40, 80],
                                    opacity: [1, 1, 0],
                                    scale: [1, 1.2, 0.8],
                                  }
                                : {}
                            }
                            transition={{
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          >
                            Add to Cart
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Image section for Lechon Belly (right side) */}
            {type === 'belly' && selectedImage && (
              <div className="w-64 flex flex-col gap-4">
                <div className="h-64 relative">
                  <Image
                    src={selectedImage}
                    alt="Selected Lechon"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
                {priceData.find(item => item.imageUrl === selectedImage) && (
                  <div className="text-center text-gray-700">
                    Available: {priceData.find(item => item.imageUrl === selectedImage).quantity} pieces
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetchonModal;