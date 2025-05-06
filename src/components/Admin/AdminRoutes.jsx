import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { Dashboard } from "./Dashboard/Dashboard";
import { Product } from "./Product/Product";
import { Category } from "./Category/Category";
import { Coupon } from "./Coupon/Counpon";

const AdminRouters = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/products" element={<Product />} />
                    <Route path="/categories" element={<Category />} />
                    <Route path="/coupons" element={<Coupon />} />
                </Route>
            </Routes>
        </>

    );
};

export default AdminRouters;
