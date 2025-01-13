export default function Footer() {
  return (
    <div className=" mx-auto bg-gradient-to-r from-primary to-blue-950 py-16 mt-10 px-8">
      <div className="flex justify-center items-center flex-col  max-w-5xl m-auto space-y-10">
        <img
          width={184}
          alt="Murni Bank logo"
          className="mr-4"
          src="/logo-white.svg"
        />
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <p className="text-white max-w-lg text-center">
              Address: Jl. Lkr. Luar Barat No.1, RT.7/RW.6, Duri Kosambi,
              Kecamatan Cengkareng, Kota Jakarta Barat, Daerah Khusus Ibukota
              Jakarta 11750{" "}
            </p>
            <p className="text-white max-w-lg text-center">
              Contact: (021) 5841060
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
