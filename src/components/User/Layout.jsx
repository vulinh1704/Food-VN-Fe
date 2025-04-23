import React from "react";
import Navbar from "./Navbar/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "./Footer/Footer";
import Popup from "./Popup/Popup";
import AuthPopup from "./Popup/AuthPopup";
import SidebarMenuPopup from "./Popup/SideBarMenuPopup";
import { Outlet } from "react-router-dom";
import { NavBarProvider } from "../../providers/users/NavBarProvider";

const Layout = () => {
    const [orderPopup, setOrderPopup] = React.useState(false);
    const [authPopup, setAuthPopup] = React.useState(false);
    const [isOpenSideBar, setIsOpenSideBar] = React.useState(false);

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
        AOS.init({
            offset: 100,
            duration: 800,
            easing: "ease-in-sine",
            delay: 100,
        });
        AOS.refresh();
    }, []);

    return (
        <>
            <NavBarProvider>
                <div className="bg-[#f5f5f5] dark:bg-gray-900 dark:text-white duration-200 ">
                    <Navbar handleOrderPopup={handleOrderPopup} handleAuthPopup={handleAuthPopup} handleSideBarMenuPopup={handleSideBarMenuPopup} />
                    <div className="pt-[170px]">
                        <Outlet />
                    </div>
                    <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
                    <AuthPopup isOpen={authPopup} setIsOpen={handleAuthPopup} />
                    <SidebarMenuPopup isOpen={isOpenSideBar} setIsOpen={setIsOpenSideBar} />
                    <Footer />
                </div>
            </NavBarProvider>
        </>
    );
};

export default Layout;
