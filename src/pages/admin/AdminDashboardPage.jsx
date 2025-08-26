import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";
import {
  FiDollarSign,
  FiUser,
  FiPackage,
  FiShoppingCart,
} from "react-icons/fi";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID");

const StatCard = ({ icon, title, value, color }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-md flex items-center space-x-4`}
  >
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/dashboard")
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <p>Memuat data...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dasbor Monitoring</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FiDollarSign />}
          title="Total Pendapatan"
          value={formatCurrency(stats.totalRevenue)}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          icon={<FiUser />}
          title="Total Pengguna"
          value={stats.totalUsers}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          icon={<FiPackage />}
          title="Total Produk"
          value={stats.totalProducts}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          icon={<FiShoppingCart />}
          title="Pesanan Baru"
          value={stats.newOrders}
          color="bg-red-100 text-red-600"
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">5 Pesanan Terbaru</h2>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Pengguna</th>
              <th className="py-2 px-4 text-left">Tanggal</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2 px-4 font-mono text-sm">
                  {order.id.substring(0, 8)}...
                </td>
                <td className="py-2 px-4">{order.user?.name || "N/A"}</td>
                <td className="py-2 px-4">{formatDate(order.createdAt)}</td>
                <td className="py-2 px-4">
                  {formatCurrency(order.grandTotal)}
                </td>
                <td className="py-2 px-4">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
