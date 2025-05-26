import { Route, Routes, Navigate } from "react-router-dom";
import UserRoutes from "./components/User/UserRoutes";
import AdminRouters from "./components/Admin/AdminRoutes";
import { useUser } from "./providers/users/UserProvider";
import { useEffect, useState } from "react";
import { getCard } from "./services/order-service/order-service";
import { useOrder } from "./providers/users/OrderProvider";

const App = () => {

  const { user, setUser } = useUser();
  const { setCard } = useOrder();
  const [isAdmin, setIsAmin] = useState(false);

  let info = JSON.parse(localStorage.getItem("user"));
  const getUserCard = async () => {
    let data = await getCard();
    setCard(data);
  }

  useEffect(() => {
    if (info) {
      setUser(info);
      getUserCard();
    }
  }, []);

  useEffect(() => {
    if (user?.roles?.some(item => item.authority == "ROLE_ADMIN")) {
      setIsAmin(true);
    }
  }, [user]);

  return (
    <>
      <Routes>
        {
          isAdmin &&
          <Route path="/admin/*" element={<AdminRouters />} />
        }
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </>
  );
};

export default App;