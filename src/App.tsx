import { Toaster } from "react-hot-toast";
import Index from "./pages/Index";

function App() {
  return (
    <>
      <Index />
      <Toaster position="top-right" />
    </>
  );
}

export default App;