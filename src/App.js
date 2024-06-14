import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./route/AppRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </div>
  );
}

export default App;
