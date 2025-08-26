import { useEffect, useState } from "react";
import axiosInstance from "../services/api";
import { LuTicketPercent } from "react-icons/lu";

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const MyCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/coupons")
      .then((res) => setCoupons(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat kupon Anda...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kupon Saya</h1>
      {coupons.length === 0 ? (
        <p>Anda belum memiliki kupon saat ini.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-gray-100 border-l-4 border-blue-500 rounded-r-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-mono font-bold text-lg">{coupon.code}</p>
                <p className="text-sm">
                  Diskon {coupon.nilai_diskon}
                  {coupon.jenis_diskon === "persentase" ? "%" : ""}
                </p>
                <p className="text-xs text-gray-500">
                  Berlaku hingga: {formatDate(coupon.expiration)}
                </p>
              </div>
              <LuTicketPercent className="text-blue-500" size={40} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCouponsPage;
