import Categories from "./Categories/Categories";
import Hero from "./Hero/Hero";
import Subscribe from "./Subscribe/Subscribe";
import Testimonials from "./Testimonials/Testimonials";
import TopProducts from "./TopProducts/TopProducts";

const Home = () => {
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
