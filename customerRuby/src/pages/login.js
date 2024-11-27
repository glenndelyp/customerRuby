import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { FaLock, FaUser } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useRouter } from "next/router";
import Link from "next/link";

const CustomAlert = ({ message, isError }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    transition={{ duration: 0.3 }}
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4"
  >
    <div className={`rounded-lg shadow-lg p-6 max-w-sm w-full flex items-center ${isError ? 'bg-red-50' : 'bg-green-50'}`}>
      {isError ? (
        <AlertCircle className="text-red-500 mr-3" size={24} />
      ) : (
        <CheckCircle className="text-green-500 mr-3" size={24} />
      )}
      <p className={`text-center ${isError ? 'text-red-800' : 'text-green-800'}`}>{message}</p>
    </div>
  </motion.div>
);



const Login = () => {
  const router = useRouter();
  const { query } = router;
  const [showPassword, setShowPassword] = useState(false);
  const [emailaddress, setEmailAddress] = useState(""); // Changed from username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/login", {
        emailaddress,
        password,
      });

      if (response.data.success) {
        router.push(query.redirect || "/letchon");
      }
    } catch (error) {
      console.error("Error:", error);

      // Display an alert for invalid credentials or other errors
      if (error.response) {
        const message = error.response.data.error || "Invalid email or password";
        window.alert(message); // Show alert popup
      } else {
        const message = "An error occurred during login";
        window.alert(message); // Show alert popup
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/check-auth");
        if (response.data.isAuthenticated) {
          router.push(query.redirect || "/letchon");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuth();
  }, [query.redirect, router]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-2"
      style={{
        backgroundImage: "url(/Login.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Head>
        <title>Ruby Belly & Lechon - Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center w-full flex-1 px-20 text-center">
        <div className="bg-orange-900 text-white rounded-2xl shadow-2xl border-2 border-black flex justify-end items-center w-full max-w-4xl h-[30rem] relative">
          <div className="bg-orange-700 w-1/1 h-3/4 rounded-2xl shadow-md p-16 m-12">
            <div className="py-2">
              <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
              <div className="border-2 w-10 border-white inline-block mb-2"></div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-4">
                <label htmlFor="emailaddress" className="sr-only">
                  Email Address
                </label>
                <div className="flex items-center bg-gray-200 rounded-md p-2">
                  <FaUser className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type="email" // Changed to email type
                    id="emailaddress"
                    name="emailaddress"
                    value={emailaddress} // Updated state variable
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-transparent outline-none text-black placeholder-gray-500"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col mb-6 relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="flex items-center bg-gray-200 rounded-md p-2">
                  <FaLock className="w-5 h-5 text-gray-500 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent outline-none text-black placeholder-gray-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 text-gray-500"
                  >
                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className={`bg-white text-orange-700 font-semibold rounded-full px-4 py-2 hover:bg-orange-500 hover:text-white transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-white">
                Don't have an account?{" "}
                <Link href="/signup">
                  <span className="text-blue-300 hover:text-blue-500 cursor-pointer">
                    Sign up
                  </span>
                </Link>
              </p>
            </div>
          </div>

          <div className="absolute top-4 left-4 p-2 bg-transparent rounded">
            <Image src="/Vector.png" width={24} height={24} alt="Vector Icon" />
          </div>

          <div className="absolute left-1/4 top-0 transform -translate-x-1/2 px-12 mt-24">
            <h3 className="text-4xl sm:text-5xl font-bold mb-2">Ruby</h3>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">Belly</h1>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">& Lechon</h1>
            <div className="text-center mb-4">
              <div className="border-2 w-12 border-white inline-block"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-10">Welcome!</h1>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
