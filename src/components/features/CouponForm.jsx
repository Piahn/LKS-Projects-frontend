import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";
import Input from "../ui/Input";
import Button from "../ui/Button";

const schema = yup.object().shape({
  code: yup.string().required("Kode kupon wajib diisi"),
  jenis_diskon: yup
    .string()
    .oneOf(["persentase", "nominal"])
    .required("Jenis diskon wajib dipilih"),
  nilai_diskon: yup
    .number()
    .typeError("Nilai diskon harus angka")
    .positive()
    .required("Nilai diskon wajib diisi"),
  expiration: yup.string().required("Tanggal kedaluwarsa wajib diisi"),
  is_active: yup.boolean(),
  userId: yup.string().nullable(), // Opsional
});

const CouponForm = ({ onFormSubmit, closeForm }) => {
  const [users, setUsers] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { is_active: true },
  });

  useEffect(() => {
    axiosInstance.get("/users").then((res) => setUsers(res.data.data));
  }, []);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label>Kode Kupon</label>
        <Input {...register("code")} placeholder="CTH: DISKONBESAR" />
        {errors.code && (
          <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Jenis Diskon</label>
          <select
            {...register("jenis_diskon")}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="persentase">Persentase (%)</option>
            <option value="nominal">Nominal (Rp)</option>
          </select>
        </div>
        <div>
          <label>Nilai Diskon</label>
          <Input
            type="number"
            {...register("nilai_diskon")}
            placeholder="10 atau 10000"
          />
          {errors.nilai_diskon && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nilai_diskon.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label>Tanggal Kedaluwarsa</label>
        <Input type="date" {...register("expiration")} />
        {errors.expiration && (
          <p className="text-red-500 text-sm mt-1">
            {errors.expiration.message}
          </p>
        )}
      </div>
      <div>
        <label>Untuk Pengguna (Opsional)</label>
        <select
          {...register("userId")}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Semua Pengguna</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("is_active")}
          id="is_active"
          className="h-4 w-4 rounded"
        />
        <label htmlFor="is_active" className="ml-2">
          Aktifkan Kupon
        </label>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={closeForm}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          Simpan Kupon
        </Button>
      </div>
    </form>
  );
};

export default CouponForm;
