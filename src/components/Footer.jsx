export default function Footer() {
  return (
    <div className=" mx-auto bg-gradient-to-r from-blue-700 to-blue-800 py-8 mt-10 p-4">
      <div className="flex justify-between flex-col  max-w-5xl m-auto space-y-10">
        <img
          width={184}
          alt="Murni Bank logo"
          className="mr-4"
          src="/logo-white.svg"
        />
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <p className="text-white max-w-lg">
              Alamat: Jl. Lkr. Luar Barat No.1, RT.7/RW.6, Duri Kosambi,
              Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota
              Jakarta 11750{" "}
            </p>
            <p className="text-white max-w-lg">Telepon: (021) 5841060</p>
          </div>
          <div className="flex gap-3">
            <img width={24} src="/Facebook.svg" alt="" />
            <img width={24} src="/Instagram.svg" alt="" />
            <img width={24} src="/Twitter.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
