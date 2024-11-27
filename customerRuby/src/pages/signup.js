import React, { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { HiEye, HiEyeOff } from "react-icons/hi";
import axios from 'axios';

export default function Signup() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailaddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    try {
      const response = await axios.post('/api/signup', {
        fullname,
        address, // Added address field
        contactnumber: phoneNumber, // Changed to match backend expectation
        emailaddress,
        password
      });
  
      if (response.data.success) {
        alert("Signup successful. Please login.");
        // Redirect to login page
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Error during signup:", error);
      if (error.response) {
        alert(error.response.data.error || "Signup failed. Please try again.");
      } else {
        alert("An error occurred during signup. Please try again later.");
      }
    }
  };
  
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100"
      style={{
        backgroundImage: 'url(/Login.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Head>
        <title>Signup</title>
        <link rel="icon" href="../public/favicon.ico" />
      </Head>

      <main className="flex justify-center items-center w-full flex-1 px-10 text-center">
        <div className="bg-orange-900 text-white rounded-2xl shadow-2xl border-2 border-black flex w-full max-w-5xl h-[40rem]">
          {/* Left Section */}
          <div className="w-1/2 flex flex-col justify-center items-center bg-orange-1000 rounded-l-2xl px-10 py-8">
            <Link href="/">
              <button className="flex items-center justify-center mb-4 p-2 bg-transparent hover:bg-gray-800 rounded">
                <Image
                  src="/Vector.png"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </button>
            </Link>
            <h2 className="text-4xl font-bold mb-4">WELCOME!</h2>
            <div className="border-2 w-10 border-white inline-block mb-8"></div>
            <p className="text-lg mb-6">Already Have an Account?</p>
            <Link href="/login">
              <button className="border-2 border-white rounded-full px-8 py-2 text-lg font-semibold hover:bg-white hover:text-red-500 transition">
                Login
              </button>
            </Link>
          </div>

          {/* Right Section */}
          <div className="w-1/2 bg-orange-700 rounded-r-2xl px-10 py-8">
            <h2 className="text-3xl font-bold text-white-700 mb-6">Signup</h2>
            <div className="border-2 w-12 border-white-700 inline-block mb-6"></div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
              <div>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Fullname"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  id="phone-number"
                  name="phone-number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Phone Number"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={emailaddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm Password"
                  required
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-3 text-gray-500"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="bg-white text-orange-700 font-semibold rounded-lg px-4 py-3 mt-4 hover:bg-orange-500 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
