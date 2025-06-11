import React, { useEffect, useState, useRef } from "react";
import Logo from "../../../assets/logo.png";
import { IoMdSearch, IoMdHome } from "react-icons/io";
import { FaBars, FaCircleInfo } from "react-icons/fa6";
import { FaRegUser, FaCcAmazonPay, FaSignOutAlt } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdFastfood } from "react-icons/md";
import { useNavbar } from "../../../providers/users/NavBarProvider";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ACTIVE_VALUE_NAVBAR } from "../../../lib/app-const";
import { useUser } from "../../../providers/users/UserProvider";
import { useOrder } from "../../../providers/users/OrderProvider";
import { getAllUserNotification, markNotificationAsRead } from "../../../services/notification-service/notification-service";
import { getFormattedDate } from "../../../lib/format-hepper";
import { useWebSocket } from "../../../hooks/useWebSocket";
import { MdOutlineNotifications } from "react-icons/md";

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
  const navigate = useNavigate();
  const [foodName, setFoodName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, setUser } = useUser();
  const { totalDetail } = useOrder();
  const { setCard } = useOrder();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState("day");
  const notificationRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setCard(null); // Reset cart data when logout
    navigate("/");
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const name = searchParams.get('name');
    if (name != null || name != undefined) setFoodName(name);
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const searchFoodName = () => {
    navigate(`/foods?name=${foodName}`);
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await getAllUserNotification({ filter });
      setNotifications(response || []);
      const unread = response.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [filter, user]);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications(notifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    // Navigate to orders page with the specific order
    if (notification.orders?.id) {
      navigate('/info/invoices', {
        state: {
          targetOrderId: notification.orders.id,
          shouldExpand: true
        }
      });
      setShowNotifications(false);
    }
  };

  // Handle click outside notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle WebSocket notifications
  useWebSocket((newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  });

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
                    value={foodName}
                    onChange={(e) => { setFoodName(e.target.value) }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        searchFoodName();
                      }
                    }}
                  />
                  <IoMdSearch className="text-gray-500 text-xl group-hover:text-[#fecb02] absolute top-1/2 right-4 -translate-y-1/2" onClick={searchFoodName} />
                </div>
              </div>
              <div className="lg:w-auto w-full hidden lg:flex justify-center lg:justify-end items-center gap-4">
                {user ?
                  <>
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100 relative user-dropdown"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <FaRegUser size={22} className="text-gray-700 transition-colors duration-200 hover:text-[#fecb02]" />
                      {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                          <Link
                            to="/info"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              setActive(ACTIVE_VALUE_NAVBAR.INFOMATION);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <FaRegUser className="mr-2" />
                            Information
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <FaSignOutAlt className="mr-2" />
                            Logout
                          </button>
                        </div>
                      )}
                    </button>

                    <div className="relative" ref={notificationRef}>
                      <button
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100"
                        onClick={() => setShowNotifications(!showNotifications)}
                      >
                        <IoNotificationsOutline size={24} className="text-gray-700 transition-colors duration-200 hover:text-[#fecb02]" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="p-3 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold">Notifications</h3>
                              <div className="flex gap-2">
                                <button
                                  className={`px-2 py-1 text-xs rounded ${filter === "day" ? "bg-[#fecb02] text-white" : "bg-gray-100"
                                    }`}
                                  onClick={() => setFilter("day")}
                                >
                                  Day
                                </button>
                                <button
                                  className={`px-2 py-1 text-xs rounded ${filter === "month" ? "bg-[#fecb02] text-white" : "bg-gray-100"
                                    }`}
                                  onClick={() => setFilter("month")}
                                >
                                  Month
                                </button>
                                <button
                                  className={`px-2 py-1 text-xs rounded ${filter === "year" ? "bg-[#fecb02] text-white" : "bg-gray-100"
                                    }`}
                                  onClick={() => setFilter("year")}
                                >
                                  Year
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                              notifications.map((notification, index) => (
                                <div
                                  key={index}
                                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                                    }`}
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  <p className="text-sm">{notification.message}</p>
                                  <span className="text-xs text-gray-500">
                                    {getFormattedDate(notification.createdAt)}
                                  </span>
                                  {notification.orders?.status === 0 && notification.orders?.cancellationReason && (
                                    <p className="text-xs text-red-500 mt-1">
                                      Reason: {notification.orders.cancellationReason}
                                    </p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                No notifications
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={handleOrderPopup}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100"
                      >
                        <IoCartOutline size={24} className="text-gray-700 transition-colors duration-200 hover:text-[#fecb02]" />
                      </button>
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalDetail}
                      </span>
                    </div>
                  </>
                  :
                  <>
                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100"
                      onClick={handleAuthPopup}
                    >
                      <FaRegUser size={22} className="text-gray-700 transition-colors duration-200 hover:text-[#fecb02]" />
                    </button>

                    <button
                      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100"
                      onClick={handleAuthPopup}
                    >
                      <IoNotificationsOutline size={25} className="text-gray-700 transition-colors duration-200 hover:text-[#fecb02]" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={handleAuthPopup}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-stone-100"
                      >
                        <IoCartOutline size={24} className="text-gray-700 transition-colors duration-200 hover:text-[#fecb02]" />
                      </button>
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalDetail}
                      </span>
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex hidden w-full bg-white shadow-sm">
        <div className="mx-auto flex justify-center">
          <ul className="flex items-center space-x-11 font-medium text-black">
            {Menu.map((data) => {
              if ((data.id == ACTIVE_VALUE_NAVBAR.INFOMATION || data.id == ACTIVE_VALUE_NAVBAR.ORDER) && !user) {
                return <li>
                  <a
                    onClick={handleAuthPopup}
                    className="inline-flex items-center gap-2 px-20 py-2 hover:text-[#fecb02] duration-200 font-medium text-sm text-gray-600"
                  >
                    <span className={`text-xl ${active === data.id ? 'text-[#fecb02]' : ''}`}>{data.icon}</span>
                    <span className={`ml-2 ${active === data.id ? 'text-[#fecb02]' : ''}`}>{data.name}</span>
                  </a>
                </li>
              }
              return (
                <li
                  key={data.id}
                  className={`relative group py-2 ${active === data.id ? 'border-b-2 border-[#fecb02] text-[#fecb02] rounded-md' : ''}`}
                  onClick={() => setActive(data.id)}
                >
                  <Link
                    to={data.link}
                    className="inline-flex items-center gap-2 px-20 py-2 hover:text-[#fecb02] duration-200 font-medium text-sm text-gray-600"
                  >
                    <span className={`text-2xl ${active === data.id ? 'text-[#fecb02]' : ''}`}>{data.icon}</span>
                    <span className={`text-md ml-2 ${active === data.id ? 'text-[#fecb02]' : ''}`}>{data.name}</span>
                  </Link>
                </li>
              )
            }
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;