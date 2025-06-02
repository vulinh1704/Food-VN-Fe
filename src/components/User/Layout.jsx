import React from "react";
import Navbar from "./Navbar/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/transitions.css";
import Footer from "./Footer/Footer";
import Popup from "./Popup/Popup";
import AuthPopup from "./Popup/AuthPopup";
import SidebarMenuPopup from "./Popup/SideBarMenuPopup";
import { Outlet, useLocation } from "react-router-dom";
import { NavBarProvider } from "../../providers/users/NavBarProvider";
import { useUser } from "../../providers/users/UserProvider";
import UserNotification from "./Notification/UserNotification";

const Layout = () => {
    const { orderPopup, setOrderPopup, user } = useUser();
    const { authPopup, setAuthPopup } = useUser();
    const [isOpenSideBar, setIsOpenSideBar] = React.useState(false);
    const location = useLocation();

    const handleOrderPopup = () => {
        setOrderPopup(!orderPopup);
    };

    const handleAuthPopup = () => {
        setAuthPopup(!authPopup);
    };

    const handleSideBarMenuPopup = () => {
        setIsOpenSideBar(!isOpenSideBar);
    };

    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [location.pathname]);

    React.useEffect(() => {
        AOS.init({
            offset: 50,
            duration: 500,
            easing: "ease-out",
            delay: 50,
        });
        AOS.refresh();
    }, []);

    return (
        <>
            <NavBarProvider>
                <div className="bg-[#f5f5f5] dark:bg-gray-900 dark:text-white duration-200">
                    <Navbar handleOrderPopup={handleOrderPopup} handleAuthPopup={handleAuthPopup} handleSideBarMenuPopup={handleSideBarMenuPopup} />
                    <div className="pt-[170px] transition-all duration-300 ease-in-out">
                        <div className="page-transition">
                            <Outlet authPopup={authPopup} setAuthPopup={setAuthPopup} />
                        </div>
                    </div>
                    <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
                    <AuthPopup isOpen={authPopup} setIsOpen={handleAuthPopup} />
                    <SidebarMenuPopup isOpen={isOpenSideBar} setIsOpen={setIsOpenSideBar} />
                    <Footer />
                    {/* {user && <UserNotification userId={user.id} />} */}
                </div>
            </NavBarProvider>
        </>
    );
};

export default Layout;
