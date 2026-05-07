import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/Layout.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Home from "./components/Home.jsx";
import Search from "./components/Search.jsx";
import About from "./components/About.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import Profile from "./components/Profile.jsx";
import Blog from "./components/Blog.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "search",
          element: <Search />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <SignUp />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "/blog/:id",
          element: <Blog />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
