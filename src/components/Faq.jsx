import { useState } from "react";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is a vehicle loan simulation?",
      answer:
        "A vehicle loan simulation is a tool used to calculate the estimated monthly installments for a vehicle loan based on tenure, down payment, and interest rates.",
    },
    {
      question: "What information is needed for a loan simulation?",
      answer:
        "You need to provide vehicle type. down payment, insurance type & area, domicile, and others.",
    },
    {
      question: "Does the loan simulation include additional fees?",
      answer:
        "Typically, a loan simulation does not include additional fees such as administrative costs. It's essential to verify with us or the dealership for a complete breakdown of all costs.",
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
