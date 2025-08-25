import { Link } from "react-router";
import { FiCheckCircle } from "react-icons/fi";
import Button from "../components/ui/Button";

const OrderSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <FiCheckCircle className="text-green-500 w-24 h-24 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800">Pesanan Berhasil</h1>
      <p className="mt-4 text-lg text-gray-600">
        Terima kasih telah berbelanja. Pesanan Anda sedang kami proses.
      </p>
      <div className="mt-8 flex space-x-4">
        <Link to="/">
          <Button variant="primary">Kembali ke Beranda</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary">Lihat Riwayat Pesanan</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
