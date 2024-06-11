import LayoutPage from "./pages/LayoutPage";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <LayoutPage />
      </BrowserRouter>
    </div>
  );
}

export default App;
