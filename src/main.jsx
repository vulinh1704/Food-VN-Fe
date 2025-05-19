import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./providers/users/UserProvider.jsx";
import { ProfileMenuProvider } from "./providers/users/ProfileMenuProvider.jsx";
import { OrderProvider } from "./providers/users/OrderProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ProfileMenuProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </ProfileMenuProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
