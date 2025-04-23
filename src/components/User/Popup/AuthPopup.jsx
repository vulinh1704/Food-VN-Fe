import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

const LoginPopup = ({ isOpen, setIsOpen }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96 relative"
          >
            <IoCloseOutline
              className="absolute top-4 right-4 text-2xl cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
            <h2 className="text-center text-xl font-bold mb-4 text-[#fecb02]">{isRegister ? "REGISTER" : "SIGN IN"}</h2>
            <div className="flex justify-between mb-4 border-b pb-2 relative">
              <span 
                className={`font-semibold cursor-pointer flex-1 text-center ${!isRegister ? "text-[#fecb02]" : "text-gray-500"}`}
                onClick={() => setIsRegister(false)}
              >
                LOGIN
              </span>
              <span 
                className={`font-semibold cursor-pointer flex-1 text-center ${isRegister ? "text-[#fecb02]" : "text-gray-500"}`}
                onClick={() => setIsRegister(true)}
              >
                REGISTER
              </span>
              <motion.div
                className="absolute bottom-0 h-[2px] bg-[#fecb02] transition-all"
                animate={{ left: isRegister ? "50%" : "0%", width: "50%" }}
              />
            </div>
            {isRegister ? (
              <form>
                <label className="block text-sm font-medium">Username *</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 mb-3"
                  required
                />
                <label className="block text-sm font-medium">Email *</label>
                <input
                  type="email"
                  className="w-full border rounded p-2 mb-3"
                  required
                />
                <label className="block text-sm font-medium">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border rounded p-2 mb-3"
                    required
                  />
                  <span 
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>
                <button className="w-full bg-[#fecb02] text-white py-2 rounded mb-3">
                  REGISTER
                </button>
              </form>
            ) : (
              <form>
                <label className="block text-sm font-medium">Username or email *</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 mb-3"
                  required
                />
                <label className="block text-sm font-medium">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border rounded p-2 mb-3"
                    required
                  />
                  <span 
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <input type="checkbox" className="mr-2" />
                  <span>Remember me</span>
                </div>
                <button className="w-full bg-[#fecb02] text-white py-2 rounded mb-3">
                  LOGIN
                </button>
              </form>
            )}
            {!isRegister && (
              <p className="text-center mt-3 text-sm text-gray-500 cursor-pointer">
                Lost your password?
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPopup;