import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaPlusCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LetchonModal from "../components/letchonModal";
import { Fragment, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from 'next/router';
import axios from 'axios';

const Letchon = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedLechonType, setSelectedLechonType] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { addToCart, cartItems } = useCart();
    const router = useRouter();
    const itemsPerPage = 6;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/check-auth');
                if (!response.data.isAuthenticated) {
                    router.push('/login?redirect=/letchon');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                router.push('/login?redirect=/letchon');
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/lechon-products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        checkAuth();
        fetchProducts();
    }, [router]);

    const handleOrder = (orderData) => {
        addToCart(orderData);
        setShowModal(false);
    };

    const cartItemCount = cartItems.length;

    // Group products by type
    const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.name]) {
            acc[product.name] = [];
        }
        acc[product.name].push(product);
        return acc;
    }, {});

    // Convert grouped products to array for pagination
    const productArray = Object.entries(groupedProducts);
    const totalPages = Math.ceil(productArray.length / itemsPerPage);

    // Get current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productArray.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    return (
        <Fragment>
            {/* Original Header */}
            <div className="w-full max-w-1xl mx-auto flex items-center justify-between border-b-2 px-2 py-7 h-16 bg-black shadow-md">
                <div className="flex items-center space-x-8">
                    <Image
                        src="/Vector.png"
                        alt="Letchon Logo"
                        width={40}
                        height={35}
                        className="object-contain"
                    />
                </div>
                <div className="flex-grow flex justify-center">
                    <div className="flex space-x-10">
                        <Link href="/letchon">
                            <button className="text-white font-bold hover:text-orange-500 transition bg-transparent border-none cursor-pointer">
                                Lechon
                            </button>
                        </Link>
                        <Link href="/viands">
                            <button className="text-white font-bold hover:text-orange-500 transition bg-transparent border-none cursor-pointer">
                                Viands
                            </button>
                        </Link>
                        <Link href="/aboutus">
                            <button className="text-white font-bold hover:text-orange-500 transition bg-transparent border-none cursor-pointer">
                                About Us
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center space-x-8">
                    <Link href="/profile">
                        <button className="flex items-center justify-center p-2 bg-transparent hover:bg-gray-800 rounded">
                            <Image
                                src="/profile.png"
                                alt="Profile"
                                width={24}
                                height={24}
                                className="cursor-pointer"
                            />
                        </button>
                    </Link>
                    <Link href="/cart">
                        <div className="relative">
                            <button className="flex items-center justify-center p-2 bg-transparent hover:bg-gray-800 rounded">
                                <Image
                                    src="/cart.png"
                                    alt="Cart"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer"
                                />
                            </button>
                            {cartItemCount > 0 && (
                                <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {cartItemCount}
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
            </div>

            {/* Updated Main Content with Pagination */}
            <div className="relative bg-[#f7c18e] min-h-[85vh] py-12">
                <div className="absolute inset-0">
                    <Image
                        src="/hehe.png" 
                        alt="Lechon Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-white text-center mb-12 shadow-text">Our Premium Lechon Selection</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentItems.map(([lechonType, typeProducts]) => (
                            <div 
                                key={lechonType}
                                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div 
                                    className="relative h-64 cursor-pointer"
                                    onClick={() => {
                                        setSelectedLechonType(lechonType);
                                        setShowModal(true);
                                    }}
                                >
                                    <Image
                                        src={typeProducts[0].imageUrl}
                                        alt={lechonType}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{lechonType}</h2>
                                    <p className="text-orange-500 font-semibold text-lg mb-4">
                                        Starting from ₱{Math.min(...typeProducts.map(p => p.price)).toFixed(2)}
                                    </p>
                                    <button 
                                        className="bg-orange-500 text-white rounded-full px-6 py-3 flex items-center justify-center space-x-2 mx-auto hover:bg-orange-600 transition-colors duration-300"
                                        onClick={() => {
                                            setSelectedLechonType(lechonType);
                                            setShowModal(true);
                                        }}
                                    >
                                        <FaPlusCircle className="text-xl" />
                                        <span>Order Now</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8 space-x-4">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-full ${
                                    currentPage === 1 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-orange-500 hover:bg-orange-600'
                                } text-white transition-colors duration-300`}
                            >
                                <FaChevronLeft className="text-xl" />
                            </button>
                            <span className="text-white font-semibold">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-full ${
                                    currentPage === totalPages 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-orange-500 hover:bg-orange-600'
                                } text-white transition-colors duration-300`}
                            >
                                <FaChevronRight className="text-xl" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Original Footer */}
            <footer className="bg-black text-white py-6">
                <div className="container mx-auto flex justify-center space-x-8">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
                        <FaTwitter className="text-2xl text-gray-600 group-hover:text-white" />
                        <span className="ml-2 text-gray-600 group-hover:text-white">Twitter</span>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
                        <FaFacebook className="text-2xl text-gray-600 group-hover:text-white" />
                        <span className="ml-2 text-gray-600 group-hover:text-white">Facebook</span>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
                        <FaInstagram className="text-2xl text-gray-600 group-hover:text-white" />
                        <span className="ml-2 text-gray-600 group-hover:text-white">Instagram</span>
                    </a>
                </div>
            </footer>

            {/* Modal */}
            <LetchonModal 
                isVisible={showModal} 
                onClose={() => {
                    setShowModal(false);
                    setSelectedLechonType(null);
                }}
                type={selectedLechonType?.toLowerCase()}
                handleOrder={handleOrder}
            />

            <style jsx>{`
                .shadow-text {
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </Fragment>
    );
};

export default Letchon;