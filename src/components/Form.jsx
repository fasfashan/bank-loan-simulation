import { useState, useEffect } from "react";

export default function FormSimulation() {
  const [errorMessage, setErrorMessage] = useState("");
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

  const [estimasiAngsuran, setEstimasiAngsuran] = useState(null);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [regencies, setRegencies] = useState([]);
  const tenors = [12, 24, 36, 48];
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch provinces");
        }
        const data = await response.json();
        setProvinces(data); // Simpan data provinsi ke state
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch daftar kabupaten/kota berdasarkan provinsi
  const fetchRegencies = async (provinceId) => {
    try {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch regencies");
      }
      const data = await response.json();
      setRegencies(data); // Simpan data kabupaten/kota ke state
    } catch (error) {
      console.error("Error fetching regencies:", error);
    }
  };
  const handleRegencyChange = (event) => {
    setFormValues((prev) => ({
      ...prev,
      domisili: event.target.value,
    }));
  };
  // Handle perubahan dropdown provinsi
  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    setFormValues((prev) => ({
      ...prev,
      provinsi: provinceId,
    }));
    fetchRegencies(provinceId); // Ambil data kabupaten/kota sesuai provinsi yang dipilih
  };

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
      setErrorMessage(
        "Please complete all forms before calculating the estimated installments."
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return;
    }

    // Improved calculation logic
    // Parse input values
    const harga = parseInt(hargaKendaraan.replace(/\./g, ""), 10) || 0;
    const dp = parseInt(uangMuka.replace(/\./g, ""), 10) || 0;

    // Yearly interest rate in decimal (misalnya 10% = 0.10)
    const bungaTahunan = 0.1;

    // Calculate monthly payments for each tenor
    setEstimasiAngsuran(
      tenors.map((tenor) => {
        const pokokPinjaman = harga - dp;
        const bungaBulanan = bungaTahunan / 12; // Convert yearly rate to monthly

        // Menggunakan rumus PMT (Payment for loan)
        // PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
        // P = Principal (pokok pinjaman)
        // r = Monthly interest rate
        // n = Total number of months

        const angsuranPerBulan = Math.round(
          (pokokPinjaman * (bungaBulanan * Math.pow(1 + bungaBulanan, tenor))) /
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
      <div className="max-w-3xl relative bg-white border border-neutral-200 shadow-md rounded-lg -mt-24 z-9 mx-auto p-12   space-y-10">
        <div className="flex justify-between gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">
              Calculate Your Loan in Seconds
            </h1>
            <p className="text-md text-neutral-600 ">
              From cars to motorcycles, use our simulation tool to find the best
              loan options for you.
            </p>
          </div>
          <img className="w-60" src="/car-leasing.png" alt="" />
        </div>
        <div className=" grid grid-cols-2 gap-12">
          <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-md">
            <div className="flex gap-2 items-center mb-8">
              <img src="/credit-icon.svg" alt="" />
              <h2 className="text-xl font-semibold">Loan Simulation</h2>
            </div>
            <form className="space-y-4">
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
                  <p className="font-medium">Car</p>
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
                  <p className="font-medium">Motorcycle</p>
                </div>
              </div>

              <div>
                <label htmlFor="jenisKendaraan" className="block mb-1">
                  Vehicle Type
                </label>
                <select
                  id="jenisKendaraan"
                  className="w-full p-2 border border-neutral-300 rounded"
                  value={formValues.jenisKendaraan}
                  onChange={handleInputChange}
                >
                  <option value="">Choose Here</option>
                  <option value="baru">New</option>
                  <option value="bekas">Second</option>
                </select>
              </div>

              <div>
                <label htmlFor="hargaKendaraan" className="block mb-1">
                  Vehicle Price
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
                  Down Payment
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
                  Insurance Area
                </label>
                <select
                  id="wilayahAsuransi"
                  className="w-full p-2 border border-neutral-300 rounded"
                  value={formValues.wilayahAsuransi}
                  onChange={handleInputChange}
                >
                  <option value="">Choose Here</option>
                  <option value="wilayah1">
                    {" "}
                    Sumatra and Surrounding Areas
                  </option>
                  onFocus=
                  {() => {
                    if ("inputMode" in document.createElement("input")) {
                      const input = document.getElementById("hargaKendaraan");
                      input.inputMode = "numeric";
                    }
                  }}
                  <option value="wilayah2">Jakarta and Bodetabek</option>
                  onFocus=
                  {() => {
                    if ("virtualKeyboard" in navigator) {
                      // @ts-ignore
                      navigator.virtualKeyboard.show();
                    }
                  }}
                  <option value="wilayah3">Other Regions in Indonesia</option>
                </select>
              </div>

              <div>
                <label htmlFor="jenisAsuransi" className="block mb-1">
                  Insurance Type
                </label>
                <select
                  id="jenisAsuransi"
                  className="w-full p-2 border border-neutral-300 rounded"
                  value={formValues.jenisAsuransi}
                  onChange={handleInputChange}
                >
                  <option value="">Choose Here</option>
                  <option value="comprehensive">
                    All Risk (Comprehensive)
                  </option>
                  <option value="tlo">Total Loss Only (TLO)</option>
                </select>
              </div>

              <div className="">
                {/* Dropdown untuk Provinsi */}
                <label htmlFor="province" className="block mb-2 font-medium">
                  Province
                </label>
                <select
                  id="province"
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  className="border rounded p-2 w-full mb-4"
                >
                  <option value="">Choose here </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>

                {/* Dropdown untuk Kabupaten/Kota */}
                <label htmlFor="regency" className="block mb-2 font-medium">
                  Domicile
                </label>
                <select
                  id="domisili" // Ubah id menjadi 'domisili' agar sesuai dengan formValues
                  value={formValues.domisili}
                  onChange={handleRegencyChange}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Select District/City</option>
                  {regencies.map((regency) => (
                    <option key={regency.id} value={regency.id}>
                      {regency.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="w-full bg-primary text-white p-2 rounded"
                onClick={handleCalculate}
              >
                Calculate Now
              </button>

              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
              )}
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
              <h2 className="text-xl font-semibold ">Loan Estimations</h2>
            </div>
            <p className="mt-4 mb-4  italic text-gray-600">
              The amounts below are estimates and may change according to the
              applicable terms and conditions.
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
                          Tenure {item.tenor} month
                        </h3>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            Monthly Installment:{" "}
                            <strong className="text-black">
                              Rp {formatCurrency(item.angsuran.toString())}
                            </strong>
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Down Payment:{" "}
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
