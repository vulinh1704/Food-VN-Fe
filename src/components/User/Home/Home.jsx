import { useEffect } from "react";
import Categories from "./Categories/Categories";
import Hero from "./Hero/Hero";
import Subscribe from "./Subscribe/Subscribe";
import Testimonials from "./Testimonials/Testimonials";
import TopProducts from "./TopProducts/TopProducts";
import { useNavbar } from "../../../providers/users/NavBarProvider";
import { ACTIVE_VALUE_NAVBAR } from "../../../lib/app-const";

const Home = ({ authPopup, setAuthPopup }) => {
    const { setActive } = useNavbar();
    useEffect(() => {
        setActive(ACTIVE_VALUE_NAVBAR.HOME);
    }, []);
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <div className="container mx-auto px-4 space-y-16 py-10">
                <Categories />
                <TopProducts />
                <Subscribe />
                <Testimonials />
            </div>
        </div>
    );
};

export default Home;
