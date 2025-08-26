import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      // Asumsi endpoint /orders akan mengembalikan semua pesanan jika user adalah admin
      const response = await axiosInstance.get("/orders");
      setOrders(response.data.data);
    } catch (error) {
      toast.error("Gagal memuat data pesanan.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success("Status pesanan berhasil diperbarui!");
      fetchOrders(); // Muat ulang data untuk menampilkan status terbaru
    } catch (error) {
      toast.error("Gagal memperbarui status.");
    }
  };

  if (loading) return <p>Memuat pesanan...</p>;

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Manajemen Pesanan</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">ID Pesanan</th>
                <th className="py-2 px-4 text-left">Tanggal</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-center">Ubah Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 font-mono text-sm">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="py-2 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-2 px-4">
                    {formatCurrency(order.grandTotal)}
                  </td>
                  <td className="py-2 px-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="w-full p-1 border border-gray-300 rounded-md"
                    >
                      <option value="pending">pending</option>
                      <option value="waiting_payment">waiting_payment</option>
                      <option value="paid">paid</option>
                      <option value="processing">processing</option>
                      <option value="shipped">shipped</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminOrderPage;
