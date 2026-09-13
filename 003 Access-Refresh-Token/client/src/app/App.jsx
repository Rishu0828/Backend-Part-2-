import "./App.css";
import routes from "./app.routes";
import { RouterProvider } from "react-router";
import AuthProvider from "../modules/auth/context/AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
};

export default App;
