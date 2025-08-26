import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CartPage from "./pages/CartPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";

// Middleware
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminProductPage from "./pages/admin/AdminProductPage";
import AdminLayout from "./components/layout/AdminLayout";
import AdminOrderPage from "./pages/admin/AdminOrderPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCouponPage from "./pages/admin/AdminCouponPage";
import MyCouponsPage from "./pages/MyCouponsPage";
import AdminCategoryPage from "./pages/admin/AdminCategoryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "orders-success",
        element: <OrderSuccessPage />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "my-coupons",
            element: <MyCouponsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  // RUTE BARU UNTUK ADMIN
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: "products",
            element: <AdminProductPage />,
          },
          {
            path: "orders",
            element: <AdminOrderPage />,
          },
          {
            path: "categories",
            element: <AdminCategoryPage />,
          },
          {
            path: "coupons",
            element: <AdminCouponPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
