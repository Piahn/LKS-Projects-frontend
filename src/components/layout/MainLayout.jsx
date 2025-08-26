import { Outlet, Link, useNavigate } from "react-router";
import { HiMiniShoppingCart } from "react-icons/hi2";

// Custom Hooks
import useAuthStore from "../../contexts/authStore";
import useCartStore from "../../contexts/cartStore";

// Componnets
import Button from "../ui/Button";

const MainLayout = () => {
  const { token, logout, user } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            TokoKita
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-blue-600"
            >
              <HiMiniShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {token ? (
              <>
                {/* Tambahkan link ke Admin Panel jika user adalah ADMIN */}
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-blue-600 font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/my-coupons"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Kupon Saya
                </Link>
                <Button variant="primary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="primary">Daftar</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* --- DAN PERUBAHAN DI SINI --- */}
      <main className="container mx-auto p-8 flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-800 p-4 text-white text-center mt-auto">
        <p>© 2025 TokoKita</p>
      </footer>
    </div>
  );
};

export default MainLayout;
