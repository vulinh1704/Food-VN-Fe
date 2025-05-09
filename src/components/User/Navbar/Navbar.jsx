import React, { useState } from "react";
import Logo from "../../../assets/logo.png";
import { IoMdSearch, IoMdHome } from "react-icons/io";
import { FaBars, FaCircleInfo } from "react-icons/fa6";
import { FaRegUser, FaCcAmazonPay } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { MdFastfood } from "react-icons/md";
import { useNavbar } from "../../../providers/users/NavBarProvider";
import { Link } from "react-router-dom";
import { ACTIVE_VALUE_NAVBAR } from "../../../lib/app-const";

const Menu = [
  {
    id: ACTIVE_VALUE_NAVBAR.HOME,
    name: "Home",
    link: "/",
    icon: <IoMdHome />
  },
  {
    id: ACTIVE_VALUE_NAVBAR.FOOD,
    name: "Foods",
    link: "/foods",
    icon: <MdFastfood />
  },
  {
    id: ACTIVE_VALUE_NAVBAR.ORDER,
    name: "Order",
    link: "/orders",
    icon: <FaCcAmazonPay />
  },
  {
    id: ACTIVE_VALUE_NAVBAR.INFOMATION,
    name: "Information",
    link: "/info",
    icon: <FaCircleInfo />
  }
];

const Navbar = ({ handleOrderPopup, handleAuthPopup, handleSideBarMenuPopup }) => {
  const { active, setActive } = useNavbar();
  return (
    <div className="shadow-md bg-white duration-200 z-40 fixed top-0 left-0 w-full">
      <div className="w-full border-b border-gray-300">
        <div className=" dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40 container">
          <div className="py-3">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="w-full flex items-center lg:w-auto lg:justify-start relative lg:static">
                <button className="text-xl lg:hidden">
                  <FaBars
                    onClick={handleSideBarMenuPopup}
                    className="text-black dark:text-white text-lg transition-colors duration-200 hover:text-[#fecb02]"
                  />
                </button>
                <a href="#" className="absolute lg:static left-1/2 -translate-x-1/2 lg:translate-x-0 flex items-center gap-2 text-[#fecb02]">
                  <img src={Logo} alt="Logo" className="w-12 lg:w-19 h-auto max-w-none" />
                  <Link to={"/"}>
                    <div className="flex flex-col items-center lg:items-start">
                      <span className="font-bold text-3xl lg:text-4xl">Food.VN</span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-normal lg:pl-4">
                        Enjoy a tasty dish!
                      </span>
                    </div>
                  </Link>
                </a>


                <div className="relative text-2xl lg:hidden ml-auto">
                  <button
                    onClick={handleOrderPopup}
                    className="p-2 flex items-center justify-center"
                  >
                    <IoCartOutline className="stroke-black stroke-[0.5] text-2xl transition-colors duration-200 hover:stroke-[#fecb02]" />
                  </button>
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    0
                  </span>
                </div>
              </div>

              <div className="flex-1 flex justify-center lg:justify-end w-full">
                <div className="relative group w-full lg:w-full max-w-full mx-4 lg:border-0 border-gray-300 lg:pb-0">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:border-[#fecb02] dark:border-gray-500 dark:bg-gray-800"
                  />
                  <IoMdSearch className="text-gray-500 text-xl group-hover:text-[#fecb02] absolute top-1/2 right-4 -translate-y-1/2" />
                </div>
              </div>
              <div className="lg:w-auto w-full hidden lg:flex justify-center lg:justify-end items-center gap-4">
                <button
                  className="p-1/2"
                  onClick={handleAuthPopup}
                >
                  <FaRegUser className="stroke-gray-600 text-xl transition-colors duration-200 hover:text-[#fecb02]" />
                </button>

                <div className="relative">
                  <button
                    onClick={handleOrderPopup}
                    className="p-2 flex items-center justify-center"
                  >
                    <IoCartOutline className="stroke-gray-600 stroke-[0.5] text-2xl transition-colors duration-200 hover:stroke-[#fecb02]" />
                  </button>
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex hidden w-full bg-white shadow-sm">
        <div className="mx-auto flex justify-center">
          <ul className="flex items-center space-x-11 font-medium text-black">
            {Menu.map((data) => (
              <li
                key={data.id}
                className={`relative group py-2 ${active === data.id ? 'border-b-2 border-[#fecb02] text-[#fecb02] rounded-md' : ''}`}
                onClick={() => setActive(data.id)}
              >
                <Link
                  to={data.link}
                  className="inline-flex items-center gap-2 px-20 py-2 hover:text-[#fecb02] duration-200 font-medium text-sm text-gray-600"
                >
                  <span className={`text-xl ${active === data.id ? 'text-[#fecb02]' : ''}`}>{data.icon}</span>
                  <span className={`ml-2 ${active === data.id ? 'text-[#fecb02]' : ''}`}>{data.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;