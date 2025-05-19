import { Route, Routes } from "react-router-dom";
import UserRoutes from "./components/User/UserRoutes";
import AdminRouters from "./components/Admin/AdminRoutes";
import { useUser } from "./providers/users/UserProvider";
import { useEffect } from "react";
import { getCard } from "./services/order-service/order-service";
import { useOrder } from "./providers/users/OrderProvider";

const App = () => {

  const { setUser } = useUser();
  const { setCard } = useOrder();

  const getUserCard = async () => {
    let data = await getCard();
    setCard(data);
  }
  
  useEffect(() => {
    let info = JSON.parse(localStorage.getItem("user"));
    if (info) {
      setUser(info);
      getUserCard();
    }
  }, []);
  return (
    <>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRouters />} />
      </Routes>
    </>
  );
};

export default App;