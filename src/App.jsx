import "./App.css";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import FormSimulation from "./components/Form";
import Header from "./components/Header";
import Slider from "./components/Slider";

function App() {
  return (
    <>
      <Header />
      <Slider />
      <FormSimulation />
      <Faq />
      <Footer />
    </>
  );
}

export default App;
