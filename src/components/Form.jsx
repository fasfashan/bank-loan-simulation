import { useState, useEffect } from "react";

export default function FormSimulation() {
  const [formValues, setFormValues] = useState({
    jenisSimulasi: "",
    jenisKendaraan: "",
    hargaKendaraan: "", // Added new field
    wilayahAsuransi: "",
    jenisAsuransi: "",
    provinsi: "",
    domisili: "",
    uangMuka: "",
  });
  const [provinces, setProvinces] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [estimasiAngsuran, setEstimasiAngsuran] = useState(null);

  const tenors = [11, 24, 36, 48];

  // Fetch provinces data
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://dev.farizdotid.com/api/daerahindonesia/provinsi"
        );
        const data = await response.json();
        setProvinces(data.provinsi);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setProvinces([]);
      }
    };

    fetchProvinces();
  }, []);
  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      jenisSimulasi: "mobil",
    }));
  }, []);
  // Fetch regencies data when province changes
  useEffect(() => {
    const fetchKabupaten = async () => {
      if (formValues.provinsi) {
        try {
          const response = await fetch(
            `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${formValues.provinsi}`
          );
          const data = await response.json();
          setKabupaten(data.kota_kabupaten);
        } catch (error) {
          console.error("Error fetching kabupaten:", error);
          setKabupaten([]);
        }
      }
    };

    fetchKabupaten();
  }, [formValues.provinsi]);
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    let formattedValue = value;

    // Format currency for hargaKendaraan and uangMuka
    if (id === "hargaKendaraan" || id === "uangMuka") {
      formattedValue = formatCurrency(value);
    }

    setFormValues((prev) => ({
      ...prev,
      [id]: formattedValue,
    }));
  };

  const formatCurrency = (value) => {
    return value.replace(/\D/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  };

  const handleCalculate = () => {
    const {
      jenisSimulasi,
      jenisKendaraan,
      hargaKendaraan,
      wilayahAsuransi,
      jenisAsuransi,
      provinsi,
      domisili,
      uangMuka,
    } = formValues;

    if (
      !jenisSimulasi ||
      !jenisKendaraan ||
      !hargaKendaraan ||
      !wilayahAsuransi ||
      !jenisAsuransi ||
      !provinsi ||
      !domisili ||
      !uangMuka
    ) {
      alert("Harap lengkapi semua form sebelum menghitung estimasi angsuran.");
      return;
    }

    // Improved calculation logic
    const harga = parseInt(hargaKendaraan.replace(/\./g, ""), 10) || 0;
    const dp = parseInt(uangMuka.replace(/\./g, ""), 10) || 0;

    // Validate minimum DP (usually 20% of vehicle price)
    // const minDP = harga * 0.2;
    // if (dp < minDP) {
    //   alert(`Uang muka minimum adalah ${formatCurrency(minDP.toString())}`);
    //   return;
    // }

    // Calculate monthly payments for each tenor
    const bunga = 0.1; // 10% annual interest rate
    setEstimasiAngsuran(
      tenors.map((tenor) => {
        const sisaHutang = harga - dp;
        const bungaBulanan = bunga / 12;
        const angsuranPerBulan = Math.round(
          (sisaHutang * bungaBulanan * Math.pow(1 + bungaBulanan, tenor)) /
            (Math.pow(1 + bungaBulanan, tenor) - 1)
        );

        return {
          tenor,
          angsuran: angsuranPerBulan,
          totalUangMuka: dp,
        };
      })
    );
  };

  return (
    <div>
      <div className="max-w-3xl relative bg-white border border-neutral-200 shadow-md rounded-lg -mt-40 z-9 mx-auto p-12   space-y-10">
        <div className="flex justify-between gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Proses Cepat dan Mudah</h1>
            <p className="text-md text-neutral-600 ">
              Murni Bank siap memenuhi kebutuhan Anda dengan proses yang mudah
              dan cepat. Nikmati pelayanan prima dan pengalaman yang
              menyenangkan, hadir di seluruh Indonesia untuk lebih dekat dengan
              Anda.
            </p>
          </div>
          <img className="w-60" src="/car-leasing.png" alt="" />
        </div>
        <div className=" grid grid-cols-2 gap-12">
          <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-md">
            <div className="flex gap-2 items-center mb-8">
              <img src="/credit-icon.svg" alt="" />
              <h2 className="text-xl font-semibold">
                Simulasi Kredit Kendaraan
              </h2>
            </div>
            <form className="space-y-4">
              <label htmlFor="jenisSimulasi" className="block mb-1">
                Pilih kendaraan:
              </label>
              <div className="flex justify-between gap-4">
                <div
                  className={`flex space-y-4 border ${
                    formValues.jenisSimulasi === "mobil"
                      ? "border-primary border-2"
                      : "border-neutral-300 opacity-50"
                  } rounded-lg flex-col justify-center items-center p-6 cursor-pointer`}
                  onClick={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      jenisSimulasi: "mobil",
                    }))
                  }
                >
                  <img src="/Mobil.png" alt="" />
                  <p className="font-medium">Mobil</p>
                </div>
                <div
                  className={`flex space-y-4 border ${
                    formValues.jenisSimulasi === "motor"
                      ? "border-primary border-2 "
                      : "border-neutral-300 opacity-50"
                  } rounded-lg flex-col justify-center items-center p-6 cursor-pointer`}
                  onClick={() =>
                    setFormValues((prev) => ({
                      ...prev,
                      jenisSimulasi: "motor",
                    }))
                  }
                >
                  <img src="/Motor.png" alt="" />
                  <p className="font-medium">Motor</p>
                </div>
              </div>

              <div>
                <label htmlFor="jenisKendaraan" className="block mb-1">
                  Jenis Kendaraan
                </label>
                <select
                  id="jenisKendaraan"
                  className="w-full p-2 border border-neutral-300 rounded"
                  value={formValues.jenisKendaraan}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Jenis Kendaraan</option>
                  <option value="baru">Baru</option>
                  <option value="bekas">Bekas</option>
                </select>
              </div>

              <div>
                <label htmlFor="hargaKendaraan" className="block mb-1">
                  Harga Kendaraan
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2">Rp</span>
                  <input
                    type="text"
                    id="hargaKendaraan"
                    className="w-full p-2 pl-12 border border-neutral-300 rounded"
                    value={formValues.hargaKendaraan}
                    onChange={handleInputChange}
                    inputMode="numeric"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="uangMuka" className="block mb-1">
                  Uang Muka
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2">Rp</span>
                  <input
                    type="text"
                    id="uangMuka"
                    className="w-full p-2 pl-12 border border-neutral-300 rounded"
                    value={formValues.uangMuka}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="wilayahAsuransi" className="block mb-1">
                  Wilayah Asuransi
                </label>
                <select
                  id="wilayahAsuransi"
                  className="w-full p-2 border border-neutral-300 rounded"
                  value={formValues.wilayahAsuransi}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Wilayah Asuransi</option>
                  <option value="wilayah1"> Sumatera dan sekitarnya</option>
                  onFocus=
                  {() => {
                    if ("inputMode" in document.createElement("input")) {
                      const input = document.getElementById("hargaKendaraan");
                      input.inputMode = "numeric";
                    }
                  }}
                  <option value="wilayah2">Jakarta dan Bodetabek</option>
                  onFocus=
                  {() => {
                    if ("virtualKeyboard" in navigator) {
                      // @ts-ignore
                      navigator.virtualKeyboard.show();
                    }
                  }}
                  <option value="wilayah3">Wilayah Indonesia Lainnya</option>
                </select>
              </div>

              <div>
                <label htmlFor="jenisAsuransi" className="block mb-1">
                  Jenis Asuransi
                </label>
                <select
                  id="jenisAsuransi"
                  className="w-full p-2 border border-neutral-300 rounded"
                  value={formValues.jenisAsuransi}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Jenis Asuransi</option>
                  <option value="comprehensive">Comprehensive</option>
                  <option value="tlo">TLO</option>
                </select>
              </div>

              <div>
                <label htmlFor="provinsi" className="block mb-1">
                  Provinsi
                </label>
                <select
                  className="w-full p-2 border border-neutral-300 rounded"
                  id="provinsi"
                  name="provinsi"
                  value={formValues.provinsi}
                  onChange={handleInputChange}
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="domisili" className="form-label">
                  Domisili
                </label>
                <select
                  className="w-full p-2 border border-neutral-300 rounded"
                  id="domisili"
                  name="domisili"
                  value={formValues.domisili}
                  onChange={handleInputChange}
                  disabled={!formValues.provinsi}
                >
                  <option value="">Pilih Kabupaten/Kota</option>
                  {Array.isArray(kabupaten) &&
                    kabupaten.map((kab) => (
                      <option key={kab.id} value={kab.id}>
                        {kab.nama}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="button"
                className="w-full bg-primary text-white p-2 rounded"
                onClick={handleCalculate}
              >
                Hitung
              </button>
              <button
                type="button"
                className="w-full bg-white border border-neutral-300 shadow-inner p-2 rounded mt-4"
                onClick={() => {
                  setFormValues({
                    jenisSimulasi: "",
                    jenisKendaraan: "",
                    hargaKendaraan: "",
                    wilayahAsuransi: "",
                    jenisAsuransi: "",
                    provinsi: "",
                    domisili: "",
                    uangMuka: "",
                  });
                  setEstimasiAngsuran(null);
                }}
              >
                Reset
              </button>
            </form>
          </div>

          <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-md">
            <div className="flex gap-2 items-center mb-8">
              <img src="/installments-icon.svg" alt="" />
              <h2 className="text-xl font-semibold ">Estimasi Angsuran</h2>
            </div>
            <p className="mt-4 mb-4  italic text-gray-600">
              Nominal angsuran bersifat estimasi dan dapat berubah sesuai dengan
              syarat dan ketentuan yang berlaku.
            </p>
            {estimasiAngsuran && (
              <div>
                <div className="space-y-4">
                  {estimasiAngsuran.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border border-neutral-300 bg-blue-50 flex items-end justify-between rounded-lg"
                    >
                      <div className="space-y-2">
                        <h3 className=" font-semibold">
                          Tenor {item.tenor} bulan
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            Angsuran per bulan:{" "}
                            <strong className="text-black">
                              Rp {formatCurrency(item.angsuran.toString())}
                            </strong>
                          </p>
                          <p className="text-sm text-gray-600">
                            Total uang muka:{" "}
                            <strong className="text-black">
                              Rp {formatCurrency(item.totalUangMuka.toString())}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
