import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Search from "./Search/Search";
import ProductDetail from "./ProductDetail/ProductDetail";
import Order from "./Order/Order";
import Profile from "./Profile/Profile";
import Information from "./Profile/Information";
import Address from "./Profile/Address";

const UserRouter = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/foods" element={<Search />} />
                    <Route path="/detail/:id" element={<ProductDetail />} />
                    <Route path="/orders" element={<Order />} />
                    <Route path="/info" element={<Profile />}>
                        <Route index element={<Information />} />
                        <Route path="address" element={<Address />} />
                    </Route>
                </Route>
            </Routes>
        </>

    );
};

export default UserRouter;
