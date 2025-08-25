import { useEffect, useState } from "react";
// import { Link } from 'react-router';
import apiClient from "../services/api";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get("/orders");
        setOrders(response.data.data);
      } catch (err) {
        setError("Gagal memuat riwayat pesanan.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Memuat riwayat pesanan...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Riwayat Pesanan Saya</h1>
      {orders.length === 0 ? (
        <p>Anda belum memiliki pesanan.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    Pesanan #{order.id.substring(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tanggal: {formatDate(order.createdAt)}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {order.status}
                </span>
              </div>
              <div className="mt-4 border-t pt-4">
                <p className="font-semibold text-right">
                  Total: {formatCurrency(order.grandTotal)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
