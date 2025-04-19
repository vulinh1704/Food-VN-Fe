import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Search from "./Search/Search";
import ProductDetail from "./ProductDetail/ProductDetail";

const UserRouter = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/detail/:id" element={<ProductDetail />} />
                </Route>
            </Routes>
        </>

    );
};

export default UserRouter;
