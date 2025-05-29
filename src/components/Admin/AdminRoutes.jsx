import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { Product } from "./Product/Product";
import { Category } from "./Category/Category";
import { Coupon } from "./Coupon/Counpon";
import { Invoices } from "./Invoices/Invoices";
import { Dashboard } from "./Dashboard/DashBoard";

const AdminRouters = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/products" element={<Product />} />
                    <Route path="/categories" element={<Category />} />
                    <Route path="/coupons" element={<Coupon />} />
                    <Route path="/invoices" element={<Invoices />} />
                </Route>
            </Routes>
        </>

    );
};

export default AdminRouters;
