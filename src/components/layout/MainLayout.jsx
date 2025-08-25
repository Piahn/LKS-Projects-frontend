import { Outlet, Link, useNavigate } from "react-router";
import useAuthStore from "../../contexts/authStore";
import Button from "../ui/Button";

const MainLayout = () => {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            TokoKita
          </Link>
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Dashboard
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

      <main className="container mx-auto p-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-8">
        <p>© 2025 TokoKita</p>
      </footer>
    </div>
  );
};

export default MainLayout;
