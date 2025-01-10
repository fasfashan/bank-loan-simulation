import "./App.css";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import FormSimulation from "./components/Form";
import Header from "./components/Header";
import Slider from "./components/Slider";
import { useState } from "react";

function App() {
  const [showPopup, setShowPopup] = useState(true);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white space-y-8 p-20 rounded-2xl shadow-lg text-center">
            <div className="space-y-1">
              <img src="/calculator.gif" className="w-40 m-auto" alt="" />
              <h2 className="text-xl font-semibold ">
                Find the Best Loan for You
              </h2>
            </div>
            <button
              onClick={handleClosePopup}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Touch here to get started
            </button>
          </div>
        </div>
      )}
      <Header />
      <Slider />
      <FormSimulation />
      <Faq />
      <Footer />
    </>
  );
}

export default App;
