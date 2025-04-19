import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import Logo from "../../../assets/logo.png";
import { FaCcAmazonPay } from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { FaCircleInfo } from "react-icons/fa6";
import { useState } from "react";

const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/#",
    icon: <IoMdHome />
  },
  {
    id: 2,
    name: "Products",
    link: "/#services",
    icon: <MdFastfood />
  },
  {
    id: 4,
    name: "Your Order",
    link: "/#",
    icon: <FaCcAmazonPay />
  },
  {
    id: 3,
    name: "Your Info",
    link: "/#",
    icon: <FaCircleInfo />
  }
];

const SidebarMenuPopup = ({ isOpen, setIsOpen }) => {
  const [active, setActive] = useState(1);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            className="fixed top-0 left-0 h-screen w-[300px] bg-white dark:bg-gray-900 shadow-lg z-50"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <a href="#" className="flex items-center gap-2 text-[#fecb02]">
                <img src={Logo} alt="Logo" className="w-12 lg:w-19 h-auto max-w-none" />
                <span className="font-bold text-3xl lg:text-4xl">Food.VN</span>
              </a>
              <IoCloseOutline
                className="text-2xl cursor-pointer hover:text-[#fecb02]"
                onClick={() => setIsOpen(false)}
              />
            </div>

            <div className="p-4 space-y-3 text-black dark:text-white">
              {Menu.map((data) => (
                <div
                  key={data.id}
                  className={`relative group ${active === data.id ? 'border-b-2 border-[#fecb02] text-[#fecb02]' : 'border-b-2 border-gray'}`}
                  onClick={() => setActive(data.id)}
                >
                  <a
                    href={data.link}
                    className="inline-flex items-center gap-2 px-20 py-4 hover:text-[#fecb02] duration-200 font-medium text-sm text-gray-600"
                  >
                    <span className={`text-xl ${active === data.id ? 'text-[#fecb02]' : ''}`}>{data.icon}</span>
                    <span className={`ml-2 ${active === data.id ? 'text-[#fecb02]' : ''}`}>{data.name}</span>
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidebarMenuPopup;