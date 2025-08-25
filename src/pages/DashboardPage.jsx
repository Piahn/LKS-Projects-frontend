import OrderHistoryPage from "./OrderHistoryPage";

const DashboardPage = () => {
  return (
    <div className="container mx-auto">
      {/* Di masa depan, kita bisa menambahkan sidebar navigasi di sini
        untuk beralih antara profil, riwayat pesanan, dll.
      */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <OrderHistoryPage />
      </div>
    </div>
  );
};

export default DashboardPage;
