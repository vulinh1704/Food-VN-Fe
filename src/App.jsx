import { Route, Routes } from "react-router-dom";
import UserRoutes from "./components/User/UserRoutes";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </>
  );
};

export default App;