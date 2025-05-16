import { Route, Routes } from "react-router-dom";
import UserRoutes from "./components/User/UserRoutes";
import AdminRouters from "./components/Admin/AdminRoutes";
import { UserProvider, useUser } from "./providers/users/UserProvider";
import { useEffect } from "react";

const App = () => {
  const { setUser } = useUser();
  useEffect(() => {
    let info = JSON.parse(localStorage.getItem("user"))
    if (info) setUser(info);
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