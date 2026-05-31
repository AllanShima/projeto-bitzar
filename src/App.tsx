import "./index.css";
import { createBrowserRouter, Navigate, Outlet } from "react-router"; // Criador de Router
import { RouterProvider } from "react-router/dom"; // Renderizador
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import UserAuthProtectedRoute from "./utils/UserAuthProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TeamSelectionPage from "./features/teams/pages/TeamSelectionPage";
import TeamAuthProtectedRoute from "./utils/TeamAuthProtectedRoute";

export function App() {

  const mainRouter = createBrowserRouter([
    // Caminho Padrão
    {
      //index: true, // Default child route
      path: '/',
      element: <LandingPage/>,
      errorElement: <NotFoundPage/>,
    },
    {
      path: '/home',
      element: 
        <UserAuthProtectedRoute>
          <TeamAuthProtectedRoute>
            <Home/>
          </TeamAuthProtectedRoute>
        </UserAuthProtectedRoute>,
    },
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/register',
      element: <Register/>
    },
    {
      path: '/teamregister',
      element:
        <UserAuthProtectedRoute>
          <TeamSelectionPage/>
        </UserAuthProtectedRoute>,
    },
  ]);

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-100">
      <RouterProvider router={mainRouter} />
      <Toaster/>
    </div> 
  );
}

export default App;
