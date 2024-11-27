import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { MdDelete } from 'react-icons/md';
import CustomAlertModal from "../components/CustomAlertModal";

export default function Cart() {
  const { cartItems, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deliveryFee = 50;
  const grandTotal = total + deliveryFee;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth');
        if (!response.data.isAuthenticated) {
          router.push('/login?redirect=/cart');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login?redirect=/cart');
      }
    };

    checkAuth();
  }, [router]);

  const handleDelete = (priceid) => {
    removeFromCart(priceid);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setIsModalOpen(true);
      return;
    }
    router.push('/payment');
  };

  const renderProductDetails = (item) => {
    if (item.productType === 'lechon') {
      return (
        <>
          <h3 className="text-lg font-semibold">{item.name} - {item.weight}</h3>
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        </>
      );
    } else {
      return (
        <>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          <p className="text-sm text-gray-600">Serves: {item.servings}</p>
        </>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Cart</title>
      </Head>

      <div className="w-full max-w-1xl mx-auto flex items-center justify-between border-b-2 px-2 py-7 h-16 bg-black shadow-md">
        <Link href="/">
          <button className="flex items-center space-x-8">
            <Image src="/Vector.png" alt="Letchon Logo" width={40} height={35} className="object-contain" />
          </button>
        </Link>
      </div>

      <div className="flex flex-col items-start justify-start bg-[#F8C794] min-h-screen px-10 py-10">
        <div className="flex justify-between w-full mb-6">
          <div className="text-2xl font-bold">
            My Orders
            <p className="text-sm text-gray-700">{cartItems.length} items in your cart</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full">
          <div className="bg-[#F8E2B0] rounded-xl shadow-lg p-4 w-full md:w-2/3">
            <div className="max-h-[600px] overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-center text-lg font-bold">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                {cartItems.map((item) => (
  <div key={`${item.priceid}-${item.productType}`} className="flex justify-between items-center border-b pb-4">
    <div className="flex items-center space-x-4">
      <Image
        src={item.productType === 'viands' ? item.imageSrc : (item.imageUrl || '/default-image.png')}
        alt={item.name}
        width={80}
        height={80}
        className="rounded-lg"
      />
                        <div>
                          {renderProductDetails(item)}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.priceid, item.quantity - 1)}
                              className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-4 py-1 bg-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.priceid, item.quantity + 1)}
                              className={`px-2 py-1 bg-gray-200 rounded-r ${
                                item.quantity >= item.availableQuantity 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'hover:bg-gray-300'
                              }`}
                              disabled={item.quantity >= item.availableQuantity}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-bold">₱{(item.price * item.quantity).toFixed(2)}</p>
                        <button 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => handleDelete(item.priceid)}
                        >
                          <MdDelete className="text-2xl" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#3A3125] text-white p-4 rounded-xl shadow-lg w-full md:w-1/3">
            <h3 className="text-xl font-bold mb-4">Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.priceid} className="flex justify-between">
                  <p>{item.name} {item.productType === 'lechon' ? `(${item.weight})` : ''} {item.quantity}x</p>
                  <p>₱{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t border-gray-500 mt-4"></div>
              <div className="flex justify-between text-xl font-bold mt-2">
                <p>Subtotal:</p>
                <p>₱{total.toFixed(2)}</p>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-xl font-bold mt-2">
                  <p>Delivery Fee:</p>
                  <p>₱{deliveryFee}</p>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold mt-2">
                <p>Total:</p>
                <p>₱{grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 w-full">
          <Link href="/payment">
            <button 
              className={`bg-[#3A3125] text-2xl font-bold px-8 py-4 text-white rounded-full shadow-md hover:bg-gray-800 ${
                cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Check out
            </button>
          </Link>
        </div>
      </div>

      <CustomAlertModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        message="Please add items to your cart before proceeding to checkout."
      />
    </div>
  );
}