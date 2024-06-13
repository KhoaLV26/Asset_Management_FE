import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./route/AppRoute";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes/>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
