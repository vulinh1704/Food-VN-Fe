import { Route, Routes } from "react-router-dom";
import UserRoutes from "./components/User/UserRoutes";
import AdminRouters from "./components/Admin/AdminRoutes";

const App = () => {

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