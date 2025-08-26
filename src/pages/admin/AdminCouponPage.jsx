import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../services/api";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import CouponForm from "../../components/features/CouponForm";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID");

const AdminCouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get("/coupons");
      setCoupons(response.data.data);
    } catch (error) {
      toast.error("Gagal mengambil data kupon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (data) => {
    try {
      const payload = {
        ...data,
        expiration: new Date(data.expiration).toISOString(),
      };

      await axiosInstance.post("/coupons", payload);
      toast.success("Kupon berhasil ditambahkan!");
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menambahkan kupon.");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm("Yakin ingin menghapus kupon ini?")) {
      try {
        await axiosInstance.delete(`/coupons/${couponId}`);
        toast.success("Kupon berhasil dihapus!");
        fetchCoupons();
      } catch (error) {
        toast.error("Gagal menghapus kupon.");
      }
    }
  };

  if (loading) return <p>Memuat data kupon...</p>;

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manajemen Kupon</h1>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Tambah Kupon
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">Kode</th>
                <th className="py-2 px-4 text-left">Jenis</th>
                <th className="py-2 px-4 text-left">Nilai</th>
                <th className="py-2 px-4 text-left">Kedaluwarsa</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b">
                  <td className="py-2 px-4 font-mono">{coupon.code}</td>
                  <td className="py-2 px-4">{coupon.jenis_diskon}</td>
                  <td className="py-2 px-4">{coupon.nilai_diskon}</td>
                  <td className="py-2 px-4">{formatDate(coupon.expiration)}</td>
                  <td className="py-2 px-4">
                    {coupon.is_active ? "Aktif" : "Tidak Aktif"}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Kupon Baru"
      >
        <CouponForm
          onFormSubmit={handleAddCoupon}
          closeForm={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default AdminCouponPage;
