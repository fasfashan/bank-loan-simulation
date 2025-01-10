import { useState } from "react";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Apa itu simulasi kredit kendaraan?",
      answer:
        "Simulasi kredit kendaraan adalah alat untuk menghitung estimasi cicilan kendaraan berdasarkan tenor, TDP, dan bunga tertentu.",
    },
    {
      question: "Apa saja data yang diperlukan untuk simulasi kredit?",
      answer:
        "Anda perlu memasukkan harga kendaraan, jumlah uang muka (TDP), tenor, dan suku bunga untuk melakukan simulasi.",
    },
    {
      question: "Apakah hasil simulasi kredit sudah termasuk biaya tambahan?",
      answer:
        "Hasil simulasi biasanya belum termasuk biaya tambahan seperti asuransi atau administrasi. Pastikan untuk memverifikasi dengan dealer.",
    },
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-20">
      <h2 className="text-2xl font-semibold mb-6">Pertanyaan umum</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 text-left text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring"
            >
              <span className="font-medium">{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeIndex === index && (
              <div className="px-4 py-3 bg-white text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
