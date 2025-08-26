import { useEffect, useState } from "react";
import axiosInstance from "../services/api";

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
        const response = await axiosInstance.get("/orders");

        setOrders(response.data.data);
      } catch (err) {
        if (err.status === 404) {
          return (
            <p className="text-center">Anda belum memiliki riwayat pesanan.</p>
          );
        }
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
          {orders.map((order) => {
            // --- LOGIKA BARU UNTUK DISKON ---
            const discount = order.subtotal + order.tax - order.grandTotal;

            return (
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
                <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pajak</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                  {/* Tampilkan baris diskon jika ada */}
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Diskon ({order.Cupon?.code})</span>
                      <span>- {formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>{formatCurrency(order.grandTotal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
