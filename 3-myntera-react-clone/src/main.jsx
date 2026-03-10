import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home.jsx";
import App from "./routes/App.jsx";
import Bag from "./routes/Bag.jsx";
import { Provider } from "react-redux";
import myntraStore from "./store/index.js";
import CategoryPage from "./routes/CategoryPage.jsx";
import AdminAddProduct from "./routes/AdminAddProduct.jsx";
import Wishlist from "./routes/Wishlist";
import { GiftCard, MyntraInsider } from "./routes/StaticPages.jsx";
import LegalPage from "./routes/LegalPage.jsx";
import Login from "./routes/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/bag",
        element: <Bag />,
      },
      { path: "/category/:categoryName", element: <CategoryPage /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/gift-cards", element: <GiftCard /> }, 
      { path: "/insider", element: <MyntraInsider /> },
      { path: "/admin-add", element: <AdminAddProduct /> },
      { path: "/page/:pageName", element: <LegalPage /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={myntraStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
