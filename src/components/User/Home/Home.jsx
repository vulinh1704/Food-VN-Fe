import { useEffect } from "react";
import Categories from "./Categories/Categories";
import Hero from "./Hero/Hero";
import Subscribe from "./Subscribe/Subscribe";
import Testimonials from "./Testimonials/Testimonials";
import TopProducts from "./TopProducts/TopProducts";
import { useNavbar } from "../../../providers/users/NavBarProvider";
import { ACTIVE_VALUE_NAVBAR } from "../../../lib/app-const";

const Home = () => {
    const { setActive } = useNavbar();
    useEffect(() => {
        setActive(ACTIVE_VALUE_NAVBAR.HOME);
    }, []);
    return (
        <>
            <Hero />
            <Categories />
            <TopProducts />
            <Subscribe />
            <Testimonials />
        </>
    );
};

export default Home;
