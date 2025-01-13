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
      setErrorMessage(
        "Harap lengkapi semua form sebelum menghitung estimasi angsuran."
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
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
                  <option value="">Choose here</option>
                  <option value="comprehensive">
                    All Risk (Comprehensive)
                  </option>
                  <option value="tlo">Total Loss Only (TLO)</option>
                </select>
              </div>

              <div>
                <label htmlFor="provinsi" className="block mb-1">
                  Province{" "}
                </label>
                <select
                  className="w-full p-2 border border-neutral-300 rounded"
                  id="provinsi"
                  name="provinsi"
                  value={formValues.provinsi}
                  onChange={handleInputChange}
                >
                  <option value="">Choose here</option>
                  {provinces.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="domisili" className="form-label">
                  Domicile
                </label>
                <select
                  className="w-full p-2 border border-neutral-300 rounded"
                  id="domisili"
                  name="domisili"
                  value={formValues.domisili}
                  onChange={handleInputChange}
                  disabled={!formValues.provinsi}
                >
                  <option value="">Choose here</option>
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
