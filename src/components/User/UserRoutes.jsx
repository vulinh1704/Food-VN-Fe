import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home/Home";
import Search from "./Search/Search";
import ProductDetail from "./ProductDetail/ProductDetail";
import Order from "./Order/Order";
import Profile from "./Profile/Profile";
import Information from "./Profile/Information";
import Address from "./Profile/Address";
import { useUser } from "../../providers/users/UserProvider";
import { OldOrder } from "./Profile/OldOrders";

const PrivateRoute = ({ children }) => {
    const { user } = useUser();
    if (!user) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const UserRouter = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="foods" element={<Search />} />
                <Route path="detail/:id" element={<ProductDetail />} />
                
                {/* Protected Routes */}
                <Route path="orders" element={
                    <PrivateRoute>
                        <Order />
                    </PrivateRoute>
                } />
                
                <Route path="info" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }>
                    <Route index element={<Information />} />
                    <Route path="address" element={<Address />} />
                    <Route path="invoices" element={<OldOrder />} />
                </Route>

                {/* Catch all route */}
                {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Route>
        </Routes>
    );
};

export default UserRouter;
