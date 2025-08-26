import { Link, Outlet } from "react-router";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <Link to="/" className="text-2xl font-bold">
          <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        </Link>
        <nav>
          <ul>
            <li>
              <Link
                to="/admin/products"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Produk
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Pesanan
              </Link>
            </li>
            <li>
              <Link
                to="/admin/categories"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Kategori
              </Link>
            </li>
            <li>
              <Link
                to="/admin/coupons"
                className="block py-2 px-4 rounded hover:bg-gray-700"
              >
                Kupon
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
