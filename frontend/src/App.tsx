import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { AppRoutes } from "./routes"

function App() {

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic"
    });
  }, []);

  return <AppRoutes />
}

export default App
